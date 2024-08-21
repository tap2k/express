import Link from 'next/link';
import { useRouter } from 'next/router';
import { MenuButton } from '../components/recorderstyles';

export default function PageMenu({ privateID }) {
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

  // Function to modify the channelId query parameter
  const modifyChannelId = (query) => {
    if (query.channelid && query.channelid.includes(':')) {
      const [modifiedChannelId] = query.channelid.split(':');
      return { ...query, channelid: modifiedChannelId };
    }
    return query;
  };
  
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
        {privateID && (
          <Link
            href={{
              pathname: router.pathname,
              query: modifyChannelId(router.query),
            }}
            passHref
            legacyBehavior
          >
            <a target="_blank" rel="noopener noreferrer">
              <MenuButton>Share</MenuButton>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
