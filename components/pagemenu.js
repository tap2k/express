import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaFilm, FaMap, FaTh, FaImages, FaHome, FaShareAlt } from 'react-icons/fa';
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
    zIndex: 50
  };
  

  const shareUrl = () => {
    if (typeof window === 'undefined') {
      setError('Sharing functionality is not available');
      return;
    }
  
    const baseurl = new URL(window.location.href);
    let channelid = new URLSearchParams(window.location.search).get('channelid');
    if (channelid && channelid.includes(':')) {
      [channelid] = channelid.split(':');
    }
    let url = `${baseurl.origin}${baseurl.pathname}?channelid=${channelid}`;
    if (editor)
      url = `${baseurl.origin}/reel?channelid=${channelid}`;
  
    if (navigator.share) {
      navigator.share({
        title: 'Share this channel',
        text: 'Check out this channel!',
        url: url
      }).then(() => {
        console.log('Successfully shared');
      }).catch((error) => {
        console.error('Error sharing:', error);
        fallbackToClipboard(url);
      });
    } else {
      fallbackToClipboard(url);
    }
  };
  
  const fallbackToClipboard = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => alert('URL copied to clipboard!'))
        .catch(err => console.error('Failed to copy URL: ', err));
    } else {
      setError('Sharing and clipboard functionality are not available');
    }
  };

  /*const copyUrlToClipboard = () => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      setError('Clipboard functionality is not available');
      return;
    }
    const baseurl = new URL(window.location.href);
    let channelid = new URLSearchParams(window.location.search).get('channelid');
    if (channelid && channelid.includes(':')) {
      [channelid] = channelid.split(':');
    }
    let url = `${baseurl.origin}${baseurl.pathname}?channelid=${channelid}`;
    if (editor)
      url = `${baseurl.origin}/reel?channelid=${channelid}`;
  
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy URL: ', err));
  };*/

  return (
      <div style={rowStyle} className="hide-on-inactive" {...props}>
        <Link href="/">
          <MenuButton>
            <FaHome />
          </MenuButton>
        </Link>
        <Link
          href={{
            pathname: `./reel`,
            query: router.query,
          }}
        >
          <MenuButton>
            <FaImages />
          </MenuButton>
        </Link>
        <Link
          href={{
            pathname: `./map`,
            query: router.query,
          }}
        >
          <MenuButton>
            <FaMap />
          </MenuButton>
        </Link>
        <Link
          href={{
            pathname: `./board`,
            query: router.query,
          }}
        >
          <MenuButton>
            <FaTh />
          </MenuButton>
        </Link>
        { loggedIn && 
            <Link
              href={{
                pathname: `./editor`,
                query: router.query,
              }}
            >
              <MenuButton>
                <FaFilm />
              </MenuButton>
            </Link> 
        }
        <MenuButton onClick={shareUrl}>
          <FaShareAlt />
        </MenuButton>
      </div>
  );
}
