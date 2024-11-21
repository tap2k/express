import nookies, { destroyCookie } from 'nookies';
import getUser from "../hooks/getuser";
import getMyChannels from "../hooks/getmychannels";
import getPublicChannels from "../hooks/getpublicchannels";
import { RecorderWrapper } from '../components/recorderstyles';
import BannerTwo from '../components/bannertwo';
import MyReels from "../components/myreels";

export default ({ user, jwt, channels }) => {

  return (
    <RecorderWrapper>
      <BannerTwo user={user} jwt={jwt} />
      <MyReels channels={channels} user={user} jwt={jwt} />
    </RecorderWrapper>
  )
}

export const getServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);  
  if (!cookies?.jwt)
  {
    let channels = await getPublicChannels();
    const processedChannels = channels.map(channel => ({
      ...channel,
      contents: channel.contents ? channel.contents.slice(0, 3) : []
  }));
    return {
      props: { channels: processedChannels }
    }
  }

  let user = await getUser(cookies.jwt);
  let channels = await getMyChannels(cookies.jwt);

  if (!user)
  { 
    destroyCookie(ctx, 'jwt', { path: '/' });
    return {
      redirect: { permanent: false, destination: '/' }
    }
  }

  return {
    props: { user, jwt: cookies.jwt, channels }
  };
}