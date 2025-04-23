
const UNSPLASH_ACCESS_KEY = 'RGe1FNkxBpplP9Z8_Dqh6ccG7gP9_FG4x8M24F0Wpl8'; // This is a demo key, consider using env variables in production

export const fetchUnsplashImages = async (category: string, count: number = 5) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${category}&count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    
    const images = await response.json();
    return images.map((img: any) => ({
      url: img.urls.regular,
      alt: img.alt_description || category,
      credit: {
        name: img.user.name,
        link: img.user.links.html
      }
    }));
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
};
