
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

// Create mock pins
export const generateMockPins = (count = 50): PinProps[] => {
  const pins: PinProps[] = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const imageId = i <= 9 ? i : (i % 9) + 1; // To cycle between 1-9
    const imageHeight = getRandomNumber(200, 500);
    
    // Images are placeholders - in a real app these would be user uploaded
    pins.push({
      id: `pin-${i}`,
      title: `${category} Inspiration ${i}`,
      description: `Beautiful ${category.toLowerCase()} inspiration for your next project`,
      image: `https://source.unsplash.com/random/300x${imageHeight}?${category.toLowerCase()}`,
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
