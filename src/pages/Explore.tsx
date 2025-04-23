
import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { categories, getPins } from "@/data/pins";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryStats {
  name: string;
  count: number;
  image: string;
}

const Explore = () => {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Get all pins and calculate stats for each category
    const pins = getPins();
    
    const stats = categories.map((category) => {
      const categoryPins = pins.filter(pin => pin.category === category);
      const randomPin = categoryPins[Math.floor(Math.random() * categoryPins.length)];
      
      return {
        name: category,
        count: categoryPins.length,
        image: randomPin?.image || "" // Will be handled by error state if missing
      };
    });
    
    setCategoryStats(stats);
    setIsLoading(false);
  }, []);

  const handleImageError = (category: string) => {
    setImageError(prev => ({
      ...prev,
      [category]: true
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-96 items-center justify-center px-4">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Explore Categories</h1>
      
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categoryStats.map((category) => (
          <a
            key={category.name}
            href={`/?category=${category.name}`}
            className="group block overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <Card className="border-0">
              <CardContent className="p-0">
                <div className="relative">
                  <AspectRatio ratio={1/1} className="overflow-hidden">
                    <img
                      src={imageError[category.name] 
                        ? `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format` 
                        : category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => handleImageError(category.name)}
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 w-full p-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} pins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Explore;
