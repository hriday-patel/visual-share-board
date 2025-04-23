
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pin, PinProps } from "@/components/Pin";
import { searchPins } from "@/data/pins";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<PinProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set image heights for masonry layout
  const setImageHeights = () => {
    const pinElements = document.querySelectorAll('.masonry-item');
    pinElements.forEach((pin) => {
      const randomSpan = Math.floor(Math.random() * 45) + 15; // between 15-60
      pin.setAttribute('style', `--span: ${randomSpan}`);
    });
  };

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      const foundPins = searchPins(searchQuery);
      setResults(foundPins);
    } else {
      setResults([]);
    }
    setIsLoading(false);
    
    // Set heights after a short delay to ensure images have loaded
    setTimeout(() => {
      setImageHeights();
    }, 100);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mx-auto mb-8 flex max-w-lg gap-2">
        <Input
          type="search"
          placeholder="Search for pins..."
          className="flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">
          <SearchIcon className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      {searchParams.get("q") && (
        <h1 className="mb-6 text-2xl font-bold">
          Search results for "{searchParams.get("q")}"
        </h1>
      )}

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <p>Loading results...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="masonry-grid">
          {results.map((pin) => (
            <div key={pin.id} className="masonry-item animate-fade-in" style={{ "--span": "30" } as React.CSSProperties}>
              <Pin {...pin} />
            </div>
          ))}
        </div>
      ) : searchParams.get("q") ? (
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">No pins found matching your search</p>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">Enter a search term to find pins</p>
        </div>
      )}
    </div>
  );
};

export default Search;
