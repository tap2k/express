/* components/prober.js */

import { Button } from "reactstrap";
import LinkWithQuery from "./linkwithquery";
import Link from "next/link";

const buttonStyle = {
  fontSize: 'xx-large',
  width: 300,
  marginTop: 15,
  borderRadius: '12px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  backgroundColor: '#4a90e2',
  borderColor: '#4a90e2',
};

const containerStyle = {
  width: '100%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  padding: '20px',
};

export default function Prober() {
  return (
    <div style={containerStyle}>
      <LinkWithQuery href="/record">
        <Button style={buttonStyle} size="lg">
          Record Audio
        </Button>
      </LinkWithQuery>

      <LinkWithQuery href="/takephoto">
        <Button style={buttonStyle} size="lg">
          Take a Photo
        </Button>
      </LinkWithQuery>

      <LinkWithQuery href="/recordvideo">
        <Button style={buttonStyle} size="lg">
          Record Video
        </Button>
      </LinkWithQuery>

      <LinkWithQuery href="/uploadfile">
        <Button style={buttonStyle} size="lg">
          Upload File
        </Button>
      </LinkWithQuery>

      <LinkWithQuery href="/reel">
        <Button style={buttonStyle} size="lg">
          View Reel
        </Button>
      </LinkWithQuery>

      {false && (
        <Link href="/">
          <Button style={buttonStyle} size="lg">
            Make a New Reel
          </Button>
        </Link>
      )}
    </div>
  );
}
