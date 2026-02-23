import { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import nookies, { destroyCookie } from 'nookies';
import getUser from "../hooks/getuser";
import getMyChannels from "../hooks/getmychannels";
import getChannelSize from "../hooks/getchannelsize";
import getUserPlan from "../hooks/getuserplan";
import createCheckout from "../hooks/createcheckout";
import createPortal from "../hooks/createportal";
import { RecorderWrapper } from '../components/recorderstyles';
import BannerTwo from '../components/bannertwo';
import MyReels from "../components/myreels";
import UsageBanner from "../components/usagebanner";
import PricingTable from "../components/pricingtable";
import LandingHero from "../components/landinghero";
import FAQ from "../components/faq";
import LandingFooter from "../components/landingfooter";

export default ({ user, jwt, channels, planData }) => {
  const [pricingOpen, setPricingOpen] = useState(false);

  const handleSelectPlan = async (plan, interval) => {
    if (planData?.plan && planData.plan !== 'free') {
      // Already subscribed — portal handles upgrades, downgrades, cancellation
      const data = await createPortal({ jwt });
      if (data?.url) window.location.href = data.url;
      return;
    }
    // First subscription — Stripe Checkout
    const data = await createCheckout({ plan, interval, jwt });
    if (data?.url) window.location.href = data.url;
  };

  return (
    <RecorderWrapper>
      {user ? (
        <>
          <BannerTwo user={user} jwt={jwt} />
          <div style={{ marginTop: '16px', marginBottom: '8px' }}>
            {planData?.tierConfig && <UsageBanner planData={planData} onUpgrade={() => setPricingOpen(true)} />}
          </div>
          <MyReels channels={channels} user={user} jwt={jwt} planData={planData} />
          <div style={{ marginTop: '24px' }} />
          <LandingFooter />
          <Modal isOpen={pricingOpen} toggle={() => setPricingOpen(false)} size="xl" centered>
            <ModalBody style={{ padding: 0, position: 'relative' }}>
              <span
                onClick={() => setPricingOpen(false)}
                style={{ position: 'absolute', top: '10px', right: '14px', fontSize: '1.5rem', cursor: 'pointer', color: '#999', zIndex: 1 }}
              >&times;</span>
              <PricingTable currentPlan={planData?.plan} onSelectPlan={handleSelectPlan} onManageBilling={async () => {
                const data = await createPortal({ jwt });
                if (data?.url) window.location.href = data.url;
              }} />
            </ModalBody>
          </Modal>
        </>
      ) : (
        <>
          <LandingHero />
          <PricingTable />
          <FAQ />
          <LandingFooter />
        </>
      )}
    </RecorderWrapper>
  )
}

export const getServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);  
  if (!cookies?.jwt)
    return { props: {} };

  let user = await getUser(cookies.jwt);
  let channels = await getMyChannels(cookies.jwt);

  if (!user || !channels)
  { 
    destroyCookie(ctx, 'jwt', { path: '/' });
    return {
      redirect: { permanent: false, destination: '/' }
    }
  }

  channels = channels.filter(channel => !channel.parent);

  for (const channel of channels) {
    if (channel.owner?.id == user.id)
      channel.size = await getChannelSize({ channelID: channel.uniqueID, jwt: cookies.jwt });
  }

  const planData = await getUserPlan(cookies.jwt);

  return {
    props: { user, jwt: cookies.jwt, channels, planData }
  };
}