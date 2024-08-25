import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaPaperclip, FaFilm, FaMap, FaTh, FaImages, FaHome } from 'react-icons/fa';
import { MenuButton } from '../components/recorderstyles';
import EmailModal from './emailmodal'; 

export default function PageMenu({ channel }) {
  const router = useRouter();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const toggleEmailModal = () => {
    setIsEmailModalOpen(!isEmailModalOpen);
  }

  const handleEmailSubmit = async (email) => {
    if (email)
    {
      const response = await axios.post('/api/makevideo', 
        {
          channelid: channel.uniqueID, // Assuming channelID is in cleanedData
          email: email}, 
        {
          headers: {
              'Content-Type': 'application/json'
        }
      });
      alert("Your video has been submitted for processing! You will receive an email when it is completed.");
    }
    setIsEmailModalOpen(false);
  };

  const rowStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'transparent',
  };

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
    <>
      <div style={rowStyle}>
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
        <MenuButton onClick={copyUrlToClipboard}>
          <FaPaperclip />
        </MenuButton>
        <MenuButton onClick={toggleEmailModal}>
          <FaFilm />
        </MenuButton>
        <Link href="/" rel="noopener noreferrer" target="_blank">
          <MenuButton>
            <FaHome />
          </MenuButton>
        </Link>
      </div>
      <EmailModal 
        isOpen={isEmailModalOpen} 
        toggle={toggleEmailModal}
        onSubmit={handleEmailSubmit}
        headerText="Download Video"
        bodyText="Please enter your email address below to receive a link to your completed video."
      />
    </>
  );
}
