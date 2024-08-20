import Link from 'next/link';
import { MenuButton } from '../components/recorderstyles';

export default function MakeButton({...props}) {
  return (
    <div {...props}>
      <Link href="/" rel="noopener noreferrer" target="_blank">
        <MenuButton>
          Make your own!
        </MenuButton>
      </Link>
    </div>
  );
};

