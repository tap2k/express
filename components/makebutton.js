import Link from 'next/link';
import { MenuButton } from '../components/recorderstyles';

export default function MakeButton() {

  const makeStyle = {
    position: 'absolute',
    top: '0.7rem',
    right: '10px',
    zIndex: 100,
    padding: 5
  };

  return (
    <Link style={makeStyle} href="/" rel="noopener noreferrer" target="_blank">
      <MenuButton>
        Make your own!
      </MenuButton>
    </Link>
  );
};

