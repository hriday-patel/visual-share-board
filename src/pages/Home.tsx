import { useEffect, useState, useCallback, useRef } from "react";
import { Pin, PinProps } from "@/components/Pin";
import { categories, getPins, initializeLocalStorage } from "@/data/pins";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const [pins, setPins] = useState<PinProps[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const loadingRef = useRef(false);
  
  const setImageHeights = () => {
    const pinElements = document.querySelectorAll('.masonry-item');
    pinElements.forEach((pin) => {
      const randomSpan = Math.floor(Math.random() * 45) + 15; // between 15-60
      pin.setAttribute('style', `--span: ${randomSpan}`);
    });
  };

  const loadMorePins = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      await initializeLocalStorage();
      const allPins = getPins();
      const newPins = allPins.filter(pin => 
        activeCategory === "All" ? true : pin.category === activeCategory
      );

      if (newPins.length === 0) {
        setHasMore(false);
      } else {
        setPins(prev => [...prev, ...newPins]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Error loading pins",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [activeCategory, toast]);

  useEffect(() => {
    const loadInitialPins = async () => {
      setIsLoading(true);
      await loadMorePins();
      
      setTimeout(() => {
        setImageHeights();
      }, 100);
    };

    setPins([]);
    setPage(1);
    setHasMore(true);
    loadInitialPins();
  }, [activeCategory, loadMorePins]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loadingRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        loadMorePins();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMorePins]);

  const filterPins = (category: string) => {
    setActiveCategory(category);
    setPins([]);
    setPage(1);
    setHasMore(true);
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
          {pins.length > 0 && (
            <div className="masonry-grid">
              {pins.map((pin) => (
                <div key={pin.id} className="masonry-item animate-fade-in" style={{ "--span": "30" } as React.CSSProperties}>
                  <Pin {...pin} />
                </div>
              ))}
            </div>
          )}
          
          {isLoading && (
            <div className="flex h-20 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {!isLoading && pins.length === 0 && (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <p className="text-lg font-medium">No pins found for {activeCategory}</p>
              <Button onClick={() => filterPins("All")}>Show all pins</Button>
            </div>
          )}
          
          {!hasMore && pins.length > 0 && (
            <div className="mt-8 text-center text-muted-foreground">
              No more pins to load
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
