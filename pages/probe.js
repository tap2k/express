/* pages/probe.js */

import Prober from "../components/prober";

export default function ProbePage() {    
  return (
    <Prober /> 
  );
};

export async function getServerSideProps(ctx) {
  const { channelid } = ctx.query;

  if (!channelid) {
      return {
          redirect: {
              destination: '/',
              permanent: false,
          },
      };
  }

  return {
      props: { }
  };
}