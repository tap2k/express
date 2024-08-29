import { getPublicID } from '../hooks/seed';
import getChannel from '../hooks/getchannel';
import Uploader from "../components/uploader";

export default ({ channel, privateID, useLocation }) => {
  return (
      <Uploader channelID={channel.uniqueID} useLocation={useLocation} privateID={privateID} />
  )
}

export async function getServerSideProps(ctx) {
  let { channelid, uselocation } = ctx.query;
  let privateID = null;

  const publicID = getPublicID(channelid);
  if (publicID)
  {
      privateID = channelid;
      channelid = publicID;
  }

  try {
      // TODO: Hack for testing
      const channel = await getChannel({ channelID: channelid, privateID: privateID });
      
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
