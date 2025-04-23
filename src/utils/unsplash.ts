
const UNSPLASH_ACCESS_KEY = 'RGe1FNkxBpplP9Z8_Dqh6ccG7gP9_FG4x8M24F0Wpl8';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

interface CachedResponse {
  data: any[];
  timestamp: number;
}

const imageCache: Record<string, CachedResponse> = {};

export const fetchUnsplashImages = async (
  category: string, 
  count: number = 12,
  page: number = 1
) => {
  const cacheKey = `${category}-${count}-${page}`;
  const now = Date.now();

  // Check cache first
  if (imageCache[cacheKey] && (now - imageCache[cacheKey].timestamp) < CACHE_DURATION) {
    return imageCache[cacheKey].data;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${category}&count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    
    const images = await response.json();
    const processedImages = images.map((img: any) => ({
      url: img.urls.regular,
      alt: img.alt_description || category,
      credit: {
        name: img.user.name,
        link: img.user.links.html
      }
    }));

    // Cache the response
    imageCache[cacheKey] = {
      data: processedImages,
      timestamp: now
    };

    return processedImages;
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
};

