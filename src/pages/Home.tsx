
import { useEffect, useState, useCallback, useRef } from "react";
import { Pin, PinProps } from "@/components/Pin";
import { categories, generateMockPins } from "@/data/pins";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";

const PINS_PER_PAGE = 12;
const INITIAL_LOAD_DELAY = 500; // Add a small delay for smoother loading

const Home = () => {
  const [pins, setPins] = useState<PinProps[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const initialLoadAttempted = useRef(false);
  const { toast } = useToast();

  const loadMorePins = useCallback(async () => {
    if (!hasMore) return;

    try {
      console.log(`Loading more pins for ${activeCategory}, page ${page}`);
      const newPins = await generateMockPins(page);
      const filteredPins = newPins.filter(pin => 
        activeCategory === "All" ? true : pin.category === activeCategory
      );

      if (filteredPins.length === 0) {
        setHasMore(false);
      } else {
        setPins(prev => [...prev, ...filteredPins]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error loading pins:", error);
      toast({
        title: "Error loading pins",
        description: "Please try again later",
        variant: "destructive",
      });
      setHasMore(false);
    }
  }, [activeCategory, page, hasMore, toast]);

  const { isLoading } = useInfiniteScroll(loadMorePins);

  useEffect(() => {
    const loadInitialPins = async () => {
      setIsInitialLoading(true);
      setPins([]);
      setPage(1);
      setHasMore(true);
      
      // Add a small delay to prevent rapid rerenders
      setTimeout(async () => {
        try {
          await loadMorePins();
        } catch (error) {
          console.error("Error loading initial pins:", error);
        } finally {
          setIsInitialLoading(false);
          initialLoadAttempted.current = true;
        }
      }, INITIAL_LOAD_DELAY);
    };

    if (!initialLoadAttempted.current || activeCategory !== "All") {
      loadInitialPins();
    }
  }, [activeCategory, loadMorePins]);

  const filterPins = (category: string) => {
    initialLoadAttempted.current = false;
    setActiveCategory(category);
  };

  // Render loading skeletons
  const renderSkeletons = () => (
    <div className="masonry-grid">
      {Array.from({ length: PINS_PER_PAGE }).map((_, index) => (
        <div 
          key={`skeleton-${index}`} 
          className="masonry-item animate-fade-in"
          style={{ "--span": "30" } as React.CSSProperties}
        >
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      ))}
    </div>
  );

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
          {isInitialLoading ? (
            renderSkeletons()
          ) : pins.length > 0 ? (
            <div className="masonry-grid">
              {pins.map((pin) => (
                <div 
                  key={pin.id} 
                  className="masonry-item animate-fade-in" 
                  style={{ "--span": Math.floor(Math.random() * 45) + 15 } as React.CSSProperties}
                >
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
          
          {isLoading && !isInitialLoading && (
            <div className="flex h-20 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {!hasMore && pins.length > 0 && !isLoading && (
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
