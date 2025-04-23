
import { PinProps } from "@/components/Pin";

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

// Mock users
const users = [
  { id: "1", name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Jamie Smith", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", name: "Taylor Wilson", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "4", name: "Jordan Lee", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: "5", name: "Casey Brown", avatar: "https://i.pravatar.cc/150?img=5" }
];

// More reliable image sources from Unsplash
const categoryImages = {
  Nature: [
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&auto=format",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&auto=format",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format"
  ],
  Travel: [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format",
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&auto=format",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format",
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format"
  ],
  Food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format"
  ],
  Art: [
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format",
    "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&auto=format",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&auto=format",
    "https://images.unsplash.com/photo-1558882224-dda166733046?w=600&auto=format"
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format",
    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&auto=format",
    "https://images.unsplash.com/photo-1528977695568-bd5e5069eb61?w=600&auto=format"
  ],
  Technology: [
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&auto=format",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format",
    "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?w=600&auto=format",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format"
  ],
  Architecture: [
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format",
    "https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=600&auto=format",
    "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600&auto=format",
    "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=600&auto=format",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format"
  ],
  Fitness: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format",
    "https://images.unsplash.com/photo-1551525212-a1dc18871d4a?w=600&auto=format"
  ],
  DIY: [
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&auto=format",
    "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=600&auto=format",
    "https://images.unsplash.com/photo-1558910089-04651033b9da?w=600&auto=format",
    "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=600&auto=format",
    "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?w=600&auto=format"
  ],
  Animals: [
    "https://images.unsplash.com/photo-1550853024-fae8143715a7?w=600&auto=format",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format",
    "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&auto=format",
    "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&auto=format",
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format"
  ],
};

// Get reliable image for a category
const getCategoryImage = (category: string): string => {
  const images = categoryImages[category as keyof typeof categoryImages] || categoryImages.Nature;
  return images[Math.floor(Math.random() * images.length)];
};

// Create mock pins
export const generateMockPins = (count = 50): PinProps[] => {
  const pins: PinProps[] = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const imageHeight = getRandomNumber(300, 600);
    
    pins.push({
      id: `pin-${i}`,
      title: `${category} Inspiration ${i}`,
      description: `Beautiful ${category.toLowerCase()} inspiration for your next project`,
      image: getCategoryImage(category),
      user: user,
      saves: getRandomNumber(5, 200),
      category: category
    });
  }
  
  return pins;
};

// We'll store our pins in localStorage to simulate persistence
export const initializeLocalStorage = () => {
  // Only initialize if pins don't exist yet
  if (!localStorage.getItem('pins')) {
    localStorage.setItem('pins', JSON.stringify(generateMockPins()));
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
