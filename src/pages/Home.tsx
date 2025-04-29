import { useEffect, useState } from "react";
import { Pin, PinProps } from "@/components/Pin";
import { categories } from "@/data/pins";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRandomPhotos, getPhotosByCategory, unsplashPhotoToPin } from "@/services/unsplash";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const [pins, setPins] = useState<PinProps[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Set image heights for masonry layout
  const setImageHeights = () => {
    const pinElements = document.querySelectorAll('.masonry-item');
    pinElements.forEach((pin) => {
      const randomSpan = Math.floor(Math.random() * 45) + 15; // between 15-60
      pin.setAttribute('style', `--span: ${randomSpan}`);
    });
  };

  useEffect(() => {
    const fetchInitialPins = async () => {
      setIsLoading(true);
      try {
        const photos = await getRandomPhotos(30);
        const formattedPins = photos.map(unsplashPhotoToPin);
        setPins(formattedPins);
      } catch (error) {
        console.error("Error fetching photos:", error);
        toast({
          title: "Error loading photos",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        // Set heights after a short delay to ensure images have loaded
        setTimeout(() => {
          setImageHeights();
        }, 300);
      }
    };

    fetchInitialPins();
  }, [toast]);

  const filterPins = async (category: string) => {
    setActiveCategory(category);
    setIsLoading(true);
    
    try {
      let photos;
      if (category === "All") {
        photos = await getRandomPhotos(30);
      } else {
        photos = await getPhotosByCategory(category, 1, 30);
      }
      
      const formattedPins = photos.map(unsplashPhotoToPin);
      setPins(formattedPins);
    } catch (error) {
      console.error("Error fetching photos for category:", error);
      toast({
        title: `Error loading ${category} photos`,
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Reset heights when filter changes
      setTimeout(() => {
        setImageHeights();
      }, 300);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="All" className="w-full">
        <div className="mb-6 overflow-x-auto pb-2">
          <TabsList className="h-auto">
            <TabsTrigger 
              value="All"
              onClick={() => filterPins("All")}
              className="px-4 py-2 data-[state=active]:bg-pin-red data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category}
                value={category}
                onClick={() => filterPins(category)}
                className="px-4 py-2 data-[state=active]:bg-pin-red data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-0">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <p>Loading pins...</p>
            </div>
          ) : pins.length > 0 ? (
            <div className="masonry-grid">
              {pins.map((pin) => (
                <div key={pin.id} className="masonry-item animate-fade-in" style={{ "--span": "30" } as React.CSSProperties}>
                  <Pin {...pin} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <p className="text-lg font-medium">No pins found for {activeCategory}</p>
              <Button onClick={() => filterPins("All")}>Show all pins</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
