import { useState, useEffect, useRef } from 'react';

export function useContainerSize(initialHeight) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        let newHeight;
        
        if (Number.isInteger(initialHeight)) {
          newHeight = initialHeight;
        } else if (Number.isInteger(width)) {
          newHeight = width;
        } else {
          newHeight = 250; // Default fallback
        }
        
        setContainerSize({ width, height: newHeight });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [initialHeight]);

  return { containerSize, containerRef };
}