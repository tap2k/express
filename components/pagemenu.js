import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaPaperclip, FaFilm, FaMap, FaTh, FaImages, FaHome } from 'react-icons/fa';
import { MenuButton } from './recorderstyles';

export default function PageMenu({ loggedIn } ) {
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
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
    opacity: 1,
    visibility: 'visible'
  };

  const copyUrlToClipboard = () => {
    const baseurl = new URL(window.location.href);
    let channelid = router.query.channelid;
    if (channelid && channelid.includes(':'))
        [channelid] = channelid.split(':');
    let pathname = baseurl.pathname;
    const url = `${baseurl.origin}${pathname}?channelid=${channelid}`;  
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy URL: ', err));
  }

  return (
    <>
      <div style={rowStyle}>
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
            pathname: `./board`,
            query: router.query,
          }}
        >
          <MenuButton>
            <FaTh />
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
        { loggedIn && <>
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
          <MenuButton onClick={copyUrlToClipboard}>
            <FaPaperclip />
          </MenuButton>
        </> }
      </div>
    </>
  );
}
