import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaFilm, FaMap, FaTh, FaImages, FaHome, FaShareAlt, FaCode } from 'react-icons/fa';
import setError from "../hooks/seterror";
import { MenuButton } from './recorderstyles';

export default function PageMenu({ loggedIn, editor, ...props } ) {
  const router = useRouter();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

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

  const getShareUrl = () => {
    if (typeof window === 'undefined') return null;
    const baseurl = new URL(window.location.href);
    let channelid = new URLSearchParams(window.location.search).get('channelid');
    if (channelid && channelid.includes(':')) {
      [channelid] = channelid.split(':');
    }
    let url = `${baseurl.origin}${baseurl.pathname}?channelid=${channelid}`;
    if (editor)
      url = `${baseurl.origin}/reel?channelid=${channelid}`;
    return url;
  };

  const shareUrl = () => {
    const url = getShareUrl();
    if (!url) {
      setError('Sharing functionality is not available');
      return;
    }

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
    setShowShareMenu(false);
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

  const copyEmbedCode = () => {
    const url = getShareUrl();
    if (!url) {
      setError('Embed functionality is not available');
      return;
    }
    const embed = `<iframe src="${url}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(embed)
        .then(() => alert('Embed code copied to clipboard!'))
        .catch(err => console.error('Failed to copy embed code: ', err));
    } else {
      setError('Clipboard functionality is not available');
    }
    setShowShareMenu(false);
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '4px',
    backgroundColor: 'rgba(40, 60, 75, 0.95)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 100,
    minWidth: '160px',
    overflow: 'hidden',
  };

  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    color: 'rgba(240, 240, 240, 1)',
    fontSize: '0.9em',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  };

  return (
      <div style={rowStyle} className="hide-on-inactive" {...props}>
        <Link href="/">
          <MenuButton title="Home">
            <FaHome />
          </MenuButton>
        </Link>
        <Link
          href={{
            pathname: `./reel`,
            query: router.query,
          }}
        >
          <MenuButton title="Slideshow">
            <FaImages />
          </MenuButton>
        </Link>
        <Link
          href={{
            pathname: `./map`,
            query: router.query,
          }}
        >
          <MenuButton title="Map">
            <FaMap />
          </MenuButton>
        </Link>
        <Link
          href={{
            pathname: `./board`,
            query: router.query,
          }}
        >
          <MenuButton title="Board">
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
              <MenuButton title="Editor">
                <FaFilm />
              </MenuButton>
            </Link>
        }
        <div ref={shareMenuRef} style={{ position: 'relative' }}>
          <MenuButton onClick={() => setShowShareMenu(!showShareMenu)} title="Share">
            <FaShareAlt />
          </MenuButton>
          {showShareMenu && (
            <div style={dropdownStyle}>
              <button
                style={dropdownItemStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(92, 131, 156, 0.5)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={shareUrl}
              >
                <FaShareAlt /> Share Link
              </button>
              <button
                style={dropdownItemStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(92, 131, 156, 0.5)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={copyEmbedCode}
              >
                <FaCode /> Copy Embed Code
              </button>
            </div>
          )}
        </div>
      </div>
  );
}
