/* components/prober.js */

import { useRouter } from "next/router";
import { Button } from "reactstrap";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert'; 
import URLAdder from "./urladder";
import LinkWithQuery from "./linkwithquery";

export default function Prober() 
{
  const router = useRouter();
  const channelID = router.query.channelid || "rx7dzpg";

  const toggleAdd = () => 
  {
    let message = 'Thanks for uploading a URL!';
    confirmAlert({
      title: 'URL uploaded',
      message: message,
      buttons: [
        { label: 'OK' }
      ]
    });
    //router.push("./?channelid=" + router.query.channelid);
  };

  return (
    <div>
      <LinkWithQuery href="/record">
        <Button style={{marginLeft: 10}} color="primary" size="lg"><h2>record audio</h2></Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href={"/takephoto"}>
        <Button style={{marginLeft: 10, marginTop: 10}} color="primary" size="lg"><h2>take a photo</h2></Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href="/recordvideo">
        <Button style={{marginLeft: 10, marginTop: 10}} color="primary" size="lg"><h2>record video</h2></Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href={"/uploadfile"}>
        <Button  style={{marginLeft: 10, marginTop: 10}} color="primary" size="lg"><h2>upload file</h2></Button>
      </LinkWithQuery>
      <br/>
      { false ? <URLAdder style={{marginLeft: 10, marginTop: 20, width: 250}} channelID={channelID} toggle={toggleAdd} /> : "" }
      <LinkWithQuery href={"/reel"}>
        <Button style={{marginLeft: 10, marginTop: 10}} color="primary" size="lg"><h2>view reel</h2></Button>
      </LinkWithQuery>
    </div>
  );
}

