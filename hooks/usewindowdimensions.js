import { useEffect, useState } from 'react';

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    windowwidth: undefined,
    windowheight: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
          windowwidth: window.innerWidth,
          windowheight: window.innerHeight,
      });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowDimensions;
}
