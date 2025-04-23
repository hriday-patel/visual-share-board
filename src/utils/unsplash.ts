
const UNSPLASH_ACCESS_KEY = 'RGe1FNkxBpplP9Z8_Dqh6ccG7gP8_FG4x8M24F0Wpl8';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface CachedResponse {
  data: any[];
  timestamp: number;
  page: number;
}

const imageCache: Record<string, CachedResponse> = {};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUnsplashImages = async (
  category: string,
  count: number = 12,
  page: number = 1,
  retryCount = 0
): Promise<any[]> => {
  const cacheKey = `${category}-${count}-${page}`;
  const now = Date.now();

  // Check cache first
  if (imageCache[cacheKey] && 
      (now - imageCache[cacheKey].timestamp) < CACHE_DURATION && 
      imageCache[cacheKey].page === page) {
    console.log('Cache hit for:', cacheKey);
    return imageCache[cacheKey].data;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${category}&count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      if (retryCount < MAX_RETRIES && response.status !== 403) {
        console.log(`Retrying fetch for ${category} (attempt ${retryCount + 1})`);
        await delay(RETRY_DELAY * (retryCount + 1));
        return fetchUnsplashImages(category, count, page, retryCount + 1);
      }
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    
    const images = await response.json();
    const processedImages = images.map((img: any) => ({
      url: img.urls.regular,
      blurHash: img.blur_hash || null,
      color: img.color || '#e0e0e0',
      alt: img.alt_description || category,
      credit: {
        name: img.user.name,
        link: img.user.links.html,
        username: img.user.username
      }
    }));

    // Cache the response with page information
    imageCache[cacheKey] = {
      data: processedImages,
      timestamp: now,
      page
    };

    return processedImages;
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    // Return cached data if available, even if expired
    if (imageCache[cacheKey]) {
      console.log('Using expired cache as fallback for:', cacheKey);
      return imageCache[cacheKey].data;
    }
    return [];
  }
};

// Clear expired cache entries
export const clearExpiredCache = () => {
  const now = Date.now();
  Object.keys(imageCache).forEach(key => {
    if (now - imageCache[key].timestamp > CACHE_DURATION) {
      delete imageCache[key];
    }
  });
};

// Run cache cleanup every 5 minutes
setInterval(clearExpiredCache, 1000 * 60 * 5);
