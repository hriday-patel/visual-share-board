
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  loadMoreDelay?: number;
}

export const useInfiniteScroll = (
  loadMore: () => Promise<void>,
  { threshold = 1.5, loadMoreDelay = 500 }: UseInfiniteScrollOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const timeoutRef = useRef<number>();

  const handleScroll = useCallback(() => {
    if (loadingRef.current) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    if (scrollHeight - scrollTop <= clientHeight * threshold) {
      loadingRef.current = true;
      setIsLoading(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Set a new timeout to prevent multiple rapid loads
      timeoutRef.current = window.setTimeout(async () => {
        try {
          await loadMore();
        } finally {
          loadingRef.current = false;
          setIsLoading(false);
        }
      }, loadMoreDelay);
    }
  }, [loadMore, threshold, loadMoreDelay]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll]);

  return { isLoading };
};
