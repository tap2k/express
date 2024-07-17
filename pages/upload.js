/* pages/upload.js */

import Prober from "../components/prober";

export default ({ channelID }) => {    
  return (
    <Prober channelID={channelID} /> 
  );
};

export async function getServerSideProps(ctx) {
  const channelid = ctx.query.channelid ? ctx.query.channelid : "rx7dzpg";
  return {
      props: { channelID: channelid }
  }
}