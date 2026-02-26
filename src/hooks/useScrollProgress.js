import { useEffect, useState } from 'react';

export function useScrollProgress(threshold = 48) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      setScrollY(window.scrollY || 0);
    };

    const onScroll = () => {
      if (frame != null) return;
      frame = window.requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (frame != null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return {
    scrollY,
    progress: Math.min(scrollY / 500, 1),
    isScrolled: scrollY > threshold,
  };
}
