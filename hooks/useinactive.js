import { useState, useEffect } from 'react';

export default function useInactive(inactivityThreshold = 2500) {
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    let timeoutId;
    const isTouchDevice = 'ontouchstart' in window;
    const timeout = isTouchDevice ? Math.max(inactivityThreshold, 5000) : inactivityThreshold;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      setIsInactive(false);
      timeoutId = setTimeout(() => setIsInactive(true), timeout);
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Set up event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('touchmove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Initial timer setup
    resetTimer();

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('touchmove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [inactivityThreshold]);

  return isInactive;
}

