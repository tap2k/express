import { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import nookies, { destroyCookie } from 'nookies';
import getUser from "../hooks/getuser";
import getMyChannels from "../hooks/getmychannels";
import getChannelSize from "../hooks/getchannelsize";
import getUserPlan from "../hooks/getuserplan";
import { RecorderWrapper } from '../components/recorderstyles';
import BannerTwo from '../components/bannertwo';
import MyReels from "../components/myreels";
import UsageBanner from "../components/usagebanner";
import PricingTable from "../components/pricingtable";
import LandingHero from "../components/landinghero";
import LandingFooter from "../components/landingfooter";

export default ({ user, jwt, channels, planData }) => {
  const [pricingOpen, setPricingOpen] = useState(false);

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
              <PricingTable currentPlan={planData?.plan} />
            </ModalBody>
          </Modal>
        </>
      ) : (
        <>
          <LandingHero />
          <PricingTable />
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

  for (const channel of channels) {
    if (channel.owner?.id == user.id)
      channel.size = await getChannelSize({ channelID: channel.uniqueID, jwt: cookies.jwt });
  }

  const planData = await getUserPlan(cookies.jwt);

  return {
    props: { user, jwt: cookies.jwt, channels, planData }
  };
}