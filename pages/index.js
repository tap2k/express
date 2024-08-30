import nookies from 'nookies';

export default function Home( ) {
}

export const getServerSideProps = async (ctx) => {
    const cookies = nookies.get(ctx);
    if (cookies?.jwt) 
      return {
        redirect: { permanent: false, destination: '/myreels' }
      }
    
    return {
        redirect: { permanent: false, destination: '/make' }
    }
    
    return { props: {} };
}
