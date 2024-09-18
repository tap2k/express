import nookies from 'nookies';
import { getPublicID } from '../hooks/seed';
import getChannel from '../hooks/getchannel';
import BannerTwo from "../components/bannertwo";
import Uploader from "../components/uploader";
import { RecorderWrapper } from '../components/recorderstyles';

export default ({ channel, privateID, jwt, useLocation }) => {
  return (
    <RecorderWrapper>
        <BannerTwo nologin />
        <Uploader channelID={channel.uniqueID} useLocation={useLocation} privateID={privateID} jwt={jwt} />
    </RecorderWrapper>
  )
}

export async function getServerSideProps(ctx) {
  let { channelid, uselocation } = ctx.query;
  const cookies = nookies.get(ctx);
  const jwt = cookies?.jwt || null;
  let privateID = null;

  const publicID = getPublicID(channelid);
  if (publicID)
  {
      privateID = channelid;
      channelid = publicID;
  }

  try {
      const channel = await getChannel({ channelID: channelid, privateID: privateID, jwt: jwt });
      
      if (!channel || (!privateID && !channel.allowsubmissions)) {
          return {
              redirect: {
                  destination: '/',
                  permanent: false,
              },
          };
      }

      return { 
          props: { 
              channel: channel,
              privateID: privateID,
              jwt: channel.canedit ? jwt : null,
              useLocation: uselocation ? uselocation : false
          } 
      };
  } catch (err) {
      console.error(err);
      return {
          redirect: {
              destination: '/',
              permanent: false,
          },
      };
  }
}
