
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const ACCESS_KEY = '0xs8LzV8wszcsmUSi4stxGFszME5U7mBD7S-46PvcBI';

export interface UnsplashPhoto {
  id: string;
  alt_description: string;
  description: string;
  urls: {
    regular: string;
    small: string;
  };
  user: {
    id: string;
    name: string;
    username: string;
    profile_image: {
      small: string;
    };
  };
  likes: number;
  tags?: Array<{ title: string }>;
}

export async function searchPhotos(query: string, page = 1, perPage = 30): Promise<UnsplashPhoto[]> {
  const response = await fetch(
    `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

export async function getRandomPhotos(count = 30): Promise<UnsplashPhoto[]> {
  const response = await fetch(
    `${UNSPLASH_API_URL}/photos/random?count=${count}`,
    {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  return await response.json();
}

export async function getPhotosByCategory(category: string, page = 1, perPage = 30): Promise<UnsplashPhoto[]> {
  return searchPhotos(category, page, perPage);
}

// Convert Unsplash photo to our app's Pin format
export function unsplashPhotoToPin(photo: UnsplashPhoto): any {
  return {
    id: photo.id,
    title: photo.alt_description || 'Untitled',
    description: photo.description || '',
    image: photo.urls.regular,
    user: {
      id: photo.user.id,
      name: photo.user.name || photo.user.username,
      avatar: photo.user.profile_image?.small,
    },
    saves: photo.likes,
    category: photo.tags && photo.tags.length > 0 ? photo.tags[0].title : undefined,
  };
}
