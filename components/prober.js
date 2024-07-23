/* components/prober.js */

import { Button } from "reactstrap";
import LinkWithQuery from "./linkwithquery";
import Link from "next/link";

const buttonStyle = {
  fontSize: 'xx-large',
  width: '300px',
  marginBottom: '15px',
  borderRadius: '12px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const containerStyle = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  boxSizing: 'border-box',
};

export default function Prober() {
  return (
    <div style={containerStyle}>
      <LinkWithQuery href="/record">
        <Button style={buttonStyle} color="primary" size="lg">
          Record Audio
        </Button>
      </LinkWithQuery>

      <LinkWithQuery href="/takephoto">
        <Button style={buttonStyle} color="primary" size="lg">
          Take a Photo
        </Button>
      </LinkWithQuery>

      <LinkWithQuery href="/recordvideo">
        <Button style={buttonStyle} color="primary" size="lg">
          Record Video
        </Button>
      </LinkWithQuery>

      <LinkWithQuery href="/uploadfile">
        <Button style={buttonStyle} color="primary" size="lg">
          Upload File
        </Button>
      </LinkWithQuery>

      <LinkWithQuery href="/reel">
        <Button style={buttonStyle} color="primary" size="lg">
          View Reel
        </Button>
      </LinkWithQuery>

      <Link href="/">
        <Button style={buttonStyle} color="primary" size="lg">
          Make a New Reel
        </Button>
      </Link>
    </div>
  );
}
