
import { PinProps } from "@/components/Pin";
import { fetchUnsplashImages } from "@/utils/unsplash";

// Function to get a random number within a range
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const categories = [
  "Nature",
  "Travel",
  "Food",
  "Art",
  "Fashion",
  "Technology",
  "Architecture",
  "Fitness",
  "DIY",
  "Animals"
];

// Expanded mock users array with 100 users
const users = Array.from({ length: 100 }, (_, index) => ({
  id: `user-${index + 1}`,
  name: `User ${index + 1}`,
  avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
}));

// More reliable image sources from Unsplash with improved categorization
export const categoryImages = {
  Nature: [
    "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500000000000 + i}?w=1200&h=1200&fit=crop&q=80&category=nature`
    )
  ],
  Travel: [
    "https://images.unsplash.com/photo-1682686580198-88e9bdea9931?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1682687221248-3116ba6ab483?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1682687220067-dced9a881b56?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1682687219570-4c596363fd96?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1682686580003-82767c069a1f?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500100000000 + i}?w=1200&h=1200&fit=crop&q=80&category=travel`
    )
  ],
  Food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500200000000 + i}?w=1200&h=1200&fit=crop&q=80&category=food`
    )
  ],
  Art: [
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1579783483458-83d02161294e?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1549887534-1541e9326642?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500300000000 + i}?w=1200&h=1200&fit=crop&q=80&category=art`
    )
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500400000000 + i}?w=1200&h=1200&fit=crop&q=80&category=fashion`
    )
  ],
  Technology: [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500500000000 + i}?w=1200&h=1200&fit=crop&q=80&category=technology`
    )
  ],
  Architecture: [
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1481253127861-534498168948?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500600000000 + i}?w=1200&h=1200&fit=crop&q=80&category=architecture`
    )
  ],
  Fitness: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500700000000 + i}?w=1200&h=1200&fit=crop&q=80&category=fitness`
    )
  ],
  DIY: [
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1558910089-04651033b9da?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1560421683-6856ea585c78?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500800000000 + i}?w=1200&h=1200&fit=crop&q=80&category=diy`
    )
  ],
  Animals: [
    "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=1200&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1520552089960-50b577bf007d?w=1200&h=1200&fit=crop",
    ...Array.from({ length: 95 }, (_, i) => 
      `https://images.unsplash.com/photo-${1500900000000 + i}?w=1200&h=1200&fit=crop&q=80&category=animals`
    )
  ],
};

// Get a random user from the users array
const getRandomUser = () => users[Math.floor(Math.random() * users.length)];

// Get specific image for a category instead of random selection
const getCategoryImage = (category: string, index: number = 0): string => {
  const images = categoryImages[category as keyof typeof categoryImages] || categoryImages.Nature;
  return images[index % images.length];
};

// Create mock pins with consistent categorization and more variety
export const generateMockPins = async (page = 1): Promise<PinProps[]> => {
  const pins: PinProps[] = [];
  const categoriesWithImages: { [key: string]: any[] } = {};

  try {
    // Fetch images for each category with more images per request
    for (const category of categories) {
      const images = await fetchUnsplashImages(category, 12, page);
      categoriesWithImages[category] = images;
    }
    
    // Generate pins using fetched images
    categories.forEach((category, categoryIndex) => {
      const categoryImages = categoriesWithImages[category] || [];
      
      // Create pins for each image
      categoryImages.forEach((image, i) => {
        const randomUser = getRandomUser();
        
        pins.push({
          id: `pin-${Date.now()}-${categoryIndex}-${i}`,
          title: `${category} - ${(page - 1) * 12 + i + 1}`,
          description: `Beautiful ${category.toLowerCase()} inspiration for your next project`,
          image: image.url || `https://source.unsplash.com/random/800x600/?${category}`,
          user: randomUser,
          saves: Math.floor(Math.random() * 195) + 5,
          category: category
        });
      });
    });
  } catch (error) {
    console.error("Error generating mock pins:", error);
    
    // Fallback to local images if API fails
    categories.forEach((category, categoryIndex) => {
      for (let i = 0; i < 12; i++) {
        const imageIndex = ((page - 1) * 12 + i) % 100;
        const imageUrl = getCategoryImage(category, imageIndex);
        const randomUser = getRandomUser();
        
        pins.push({
          id: `pin-${Date.now()}-${categoryIndex}-${i}`,
          title: `${category} - ${(page - 1) * 12 + i + 1}`,
          description: `Beautiful ${category.toLowerCase()} inspiration for your next project`,
          image: imageUrl,
          user: randomUser,
          saves: Math.floor(Math.random() * 195) + 5,
          category: category
        });
      }
    });
  }
  
  return pins;
};

// We'll store our pins in localStorage to simulate persistence
export const initializeLocalStorage = async () => {
  if (!localStorage.getItem('pins')) {
    const pins = await generateMockPins();
    localStorage.setItem('pins', JSON.stringify(pins));
  }
};

export const getPins = (): PinProps[] => {
  return JSON.parse(localStorage.getItem('pins') || '[]');
};

export const getPinById = (id: string): PinProps | undefined => {
  const pins = getPins();
  return pins.find(pin => pin.id === id);
};

export const getPinsByCategory = (category: string): PinProps[] => {
  const pins = getPins();
  return pins.filter(pin => pin.category === category);
};

export const searchPins = (query: string): PinProps[] => {
  const pins = getPins();
  const lowerCaseQuery = query.toLowerCase();
  
  return pins.filter(pin => 
    pin.title.toLowerCase().includes(lowerCaseQuery) ||
    (pin.description && pin.description.toLowerCase().includes(lowerCaseQuery)) ||
    pin.category?.toLowerCase().includes(lowerCaseQuery)
  );
};

export const savePin = (pin: PinProps): void => {
  const pins = getPins();
  const existingPinIndex = pins.findIndex(p => p.id === pin.id);
  
  if (existingPinIndex >= 0) {
    // Update existing pin
    pins[existingPinIndex] = pin;
  } else {
    // Add new pin
    pins.push({
      ...pin,
      id: `pin-${Date.now()}`, // Ensure unique ID
    });
  }
  
  localStorage.setItem('pins', JSON.stringify(pins));
};
