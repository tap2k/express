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
        </div>
    </div>
  );
}
