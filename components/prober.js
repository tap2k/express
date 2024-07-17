/* components/prober.js */

import { Button } from "reactstrap";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert'; 
import URLAdder from "./urladder";
import LinkWithQuery from "./linkwithquery";

export default function Prober({ channelID }) 
{
  const toggleAdd = () => 
  {
    let message = 'Thanks for uploading a URL!';
    confirmAlert({
      title: 'URL uploaded',
      message: message,
      buttons: [{ label: 'OK' }]
    });
    //router.push("./?channelid=" + router.query.channelid);
  };

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
      <LinkWithQuery href="/record">
        <Button style={{fontSize: 'xx-large'}} color="primary" size="lg">record audio</Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href={"/takephoto"}>
        <Button style={{marginTop: 10, fontSize: 'xx-large'}} color="primary" size="lg">take a photo</Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href="/recordvideo">
        <Button style={{marginTop: 10, fontSize: 'xx-large'}} color="primary" size="lg">record video</Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href={"/uploadfile"}>
        <Button  style={{marginTop: 10, fontSize: 'xx-large'}} color="primary" size="lg">upload file</Button>
      </LinkWithQuery>
      <br/>
      { false ? <URLAdder style={{marginTop: 20, width: 250}} channelID={channelID} toggle={toggleAdd} /> : "" }
      <LinkWithQuery href={"/reel"}>
        <Button style={{marginTop: 10, fontSize: 'xx-large'}} color="primary" size="lg">view reel</Button>
      </LinkWithQuery>
    </div>
  );
}

