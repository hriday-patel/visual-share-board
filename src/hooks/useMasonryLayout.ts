
import { useEffect } from 'react';

interface UseMasonryLayoutOptions {
  /**
   * Delay in milliseconds before applying the layout
   */
  delay?: number;
  /**
   * Selector for the masonry items
   */
  itemSelector?: string;
  /**
   * Min and max span values for the masonry items
   */
  spanRange?: {
    min: number;
    max: number;
  };
}

/**
 * Hook for handling masonry layout logic
 */
export function useMasonryLayout(
  dependencies: any[] = [], 
  options: UseMasonryLayoutOptions = {}
) {
  const {
    delay = 300,
    itemSelector = '.masonry-item',
    spanRange = { min: 15, max: 60 }
  } = options;

  useEffect(() => {
    // Set image heights for masonry layout
    const timer = setTimeout(() => {
      const pinElements = document.querySelectorAll(itemSelector);
      pinElements.forEach((pin) => {
        const randomSpan = Math.floor(Math.random() * 
          (spanRange.max - spanRange.min + 1)) + spanRange.min;
        pin.setAttribute('style', `--span: ${randomSpan}`);
      });
    }, delay);
    
    return () => clearTimeout(timer);
  }, dependencies);
}
