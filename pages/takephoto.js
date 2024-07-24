import MyCamera from "../components/mycamera";

export default function TakePhotoPage({ channelID, useLocation }) {
  return (
    <MyCamera channelID={channelID} useLocation={useLocation} />
  );
}

export async function getServerSideProps(ctx) {
  const { channelid, uselocation } = ctx.query;

  if (!channelid) {
      return {
          redirect: {
              destination: '/',
              permanent: false,
          },
      };
  }

  return {
      props: { channelID: channelid, useLocation: uselocation }
  };
}