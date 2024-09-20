import nookies from 'nookies';
import getChannel from '../hooks/getchannel';
import BannerTwo from "../components/bannertwo";
import Uploader from "../components/uploader";
import { RecorderWrapper } from '../components/recorderstyles';

export default ({ channel, jwt, useLocation }) => {
  return (
    <RecorderWrapper>
        <BannerTwo nologin />
        <Uploader channelID={channel.uniqueID} useLocation={useLocation} jwt={jwt} />
    </RecorderWrapper>
  )
}

export async function getServerSideProps(ctx) {
  let { channelid, uselocation } = ctx.query;

  // TODO: Allow logged in users?
  const cookies = nookies.get(ctx);
  const jwt = cookies?.jwt || null;

  try {
      const channel = await getChannel({ channelID: channelid, jwt: jwt });
      
      if (!channel || !channel.allowsubmissions) {
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
              jwt: channel.canedit ? jwt : null,
              //useLocation: uselocation ? uselocation : false
              useLocation: true
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
