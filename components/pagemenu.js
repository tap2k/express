import Link from 'next/link';
import { useRouter } from 'next/router';
import { MenuButton } from '../components/recorderstyles';

export default function PageMenu({ privateID, isSlideshow=false }) {
  const router = useRouter();

  const menuStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: 1000
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'transparent',
  };

  const pages = ['reel', 'board', 'map'];

  const copyUrlToClipboard = () => {
    const baseurl = new URL(window.location.href);
    let channelid = router.query.channelid;
    if (channelid && channelid.includes(':'))
        [channelid] = channelid.split(':');
    let pathname = baseurl.pathname;
    if (pathname === "/admin" || pathname === "/wall")
      pathname = "/board";
    const url = `${baseurl.origin}${pathname}?channelid=${channelid}`;  
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy URL: ', err));
  }

  return (
    <div style={menuStyle}>
      <div style={rowStyle}>
        {pages.map((page) => (
          <Link
            key={page}
            href={{
              pathname: `./${page}`,
              query: router.query,
            }}
          >
            <MenuButton>
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </MenuButton>
          </Link>
        ))}
        {!isSlideshow && <MenuButton onClick={copyUrlToClipboard}>Share</MenuButton>}
      </div>
    </div>
  );
}
