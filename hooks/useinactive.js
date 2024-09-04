import { useState, useEffect } from 'react';

export default function useInactive(inactivityThreshold = 3000) {
  const [isInactive, setIsInactive] = useState(false);
  
  useEffect(() => {
    let timeoutId;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      setIsInactive(false);
      timeoutId = setTimeout(() => setIsInactive(true), inactivityThreshold);
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Set up event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Initial timer setup
    resetTimer();

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [inactivityThreshold]);

  return isInactive;
}

