import nookies, { destroyCookie } from 'nookies';
import getUser from "../hooks/getuser";
import getMyChannels from "../hooks/getmychannels";
import { RecorderWrapper } from '../components/recorderstyles';
import BannerTwo from '../components/bannertwo';
import MyReels from "../components/myreels";

export default ({ user, jwt, channels }) => {

  return (
    <RecorderWrapper>
      <BannerTwo jwt={jwt} />
      <MyReels channels={channels} user={user} jwt={jwt} />
    </RecorderWrapper>
  )
}

export const getServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);    
  if (!cookies?.jwt)
  {
    return {
      redirect: { permanent: false, destination: '/' }
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
    props: { user: user, jwt: cookies.jwt, channels: channels }
  };
}