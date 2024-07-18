/* components/prober.js */

import { Button } from "reactstrap";
import 'react-confirm-alert/src/react-confirm-alert.css';
import LinkWithQuery from "./linkwithquery";

export default function Prober() 
{
  return (
    <div style={{width: '100%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
      <LinkWithQuery href="/record">
        <Button style={{fontSize: 'xx-large', width: 300}} color="primary" size="lg">record audio</Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href={"/takephoto"}>
        <Button style={{marginTop: 10, fontSize: 'xx-large', width: 300}} color="primary" size="lg">take a photo</Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href="/recordvideo">
        <Button style={{marginTop: 10, fontSize: 'xx-large', width: 300}} color="primary" size="lg">record video</Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href={"/uploadfile"}>
        <Button style={{marginTop: 10, fontSize: 'xx-large', width: 300}} color="primary" size="lg">upload file</Button>
      </LinkWithQuery>
      <br/>
      <LinkWithQuery href={"/reel"}>
        <Button style={{marginTop: 10, fontSize: 'xx-large', width: 300}} color="primary" size="lg">view reel</Button>
      </LinkWithQuery>
    </div>
  );
}

