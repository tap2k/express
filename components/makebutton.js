import Link from 'next/link';
import { MenuButton } from '../components/recorderstyles';

export default function MakeButton({...props}) {

  const makeStyle = {
    position: 'absolute',
    top: '15px',
    right: '10px',
    zIndex: 90
  };

  return (
    <Link style={makeStyle} href="/" rel="noopener noreferrer" target="_blank">
      <MenuButton>
        Make your own!
      </MenuButton>
    </Link>
  );
};

