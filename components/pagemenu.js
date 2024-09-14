import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaPaperclip, FaFilm, FaMap, FaTh, FaImages, FaHome } from 'react-icons/fa';
import setError from "../hooks/seterror";
import { MenuButton } from './recorderstyles';

export default function PageMenu({ loggedIn, editor, ...props } ) {
  const router = useRouter();

  const rowStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.35rem',
    backgroundColor: 'transparent',
  };
  
  const copyUrlToClipboard = () => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      setError('Clipboard functionality is not available');
      return;
    }
    const baseurl = new URL(window.location.href);
    let channelid = new URLSearchParams(window.location.search).get('channelid');
    if (channelid && channelid.includes(':')) {
      [channelid] = channelid.split(':');
    }
    const url = `${baseurl.origin}${baseurl.pathname}?channelid=${channelid}`;
  
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy URL: ', err));
  };

  return (
      <div style={rowStyle} className="hide-on-inactive" {...props}>
        <Link href="/">
          <MenuButton>
            <FaHome />
          </MenuButton>
        </Link>
        <a
          href={{
            pathname: `./reel`,
            query: router.query,
          }}
        >
          <MenuButton>
            <FaImages />
          </MenuButton>
        </a>
        <a
          href={{
            pathname: `./map`,
            query: router.query,
          }}
        >
          <MenuButton>
            <FaMap />
          </MenuButton>
        </a>
        <a
          href={{
            pathname: `./board`,
            query: router.query,
          }}
        >
          <MenuButton>
            <FaTh />
          </MenuButton>
        </a>
        { loggedIn && <>
          <a
            href={{
              pathname: `./editor`,
              query: router.query,
            }}
          >
            <MenuButton>
              <FaFilm />
            </MenuButton>
          </a>
          {!editor && <MenuButton onClick={copyUrlToClipboard}>
            <FaPaperclip />
          </MenuButton>}
        </> }
      </div>
  );
}
