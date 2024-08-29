import { getPublicID } from '../hooks/seed';
import getChannel from '../hooks/getchannel';
import Uploader from "../components/uploader";

export default ({ channel, useLocation }) => {
  return (
      <Uploader channelID={channel.uniqueID} useLocation={useLocation} />
  )
}

export async function getServerSideProps(ctx) {
  let { channelid, admin, uselocation } = ctx.query;
  let privateID = null;
  if (!admin)
      admin = false;

  const publicID = getPublicID(channelid);
  if (publicID)
  {
      privateID = channelid;
      channelid = publicID;
  }

  try {
      // TODO: Hack for testing
      const channel = await getChannel({ channelID: channelid, privateID: privateID ? privateID : admin });
      
      if (!channel) {
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
              privateID: privateID ? privateID : admin,
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
