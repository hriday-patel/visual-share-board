
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Pin, PinProps } from "@/components/Pin";
import { searchPins } from "@/data/pins";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<PinProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [commandResults, setCommandResults] = useState<PinProps[]>([]);

  // Set image heights for masonry layout
  const setImageHeights = () => {
    const pinElements = document.querySelectorAll('.masonry-item');
    pinElements.forEach((pin) => {
      const randomSpan = Math.floor(Math.random() * 45) + 15; // between 15-60
      pin.setAttribute('style', `--span: ${randomSpan}`);
    });
  };

  useEffect(() => {
    // Register keyboard shortcut for command palette
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
      setOpen(false);
    }
  };

  const handleCommandSearch = (value: string) => {
    if (value.length > 1) {
      const foundPins = searchPins(value);
      setCommandResults(foundPins.slice(0, 5)); // Limit to 5 results for performance
    } else {
      setCommandResults([]);
    }
  };

  const handleCommandSelection = (selectedQuery: string) => {
    setQuery(selectedQuery);
    setSearchParams({ q: selectedQuery });
    setOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mx-auto mb-8 flex max-w-lg gap-2">
        <Input
          type="search"
          placeholder="Search for pins... (Press ⌘K)"
          className="flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => setOpen(true)}
        />
        <Button type="submit">
          <SearchIcon className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search pins, categories, or users..." 
          onValueChange={handleCommandSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {commandResults.map((result) => (
              <CommandItem 
                key={result.id}
                onSelect={() => handleCommandSelection(result.title)}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded overflow-hidden bg-muted">
                  <img 
                    src={result.image} 
                    alt={result.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format";
                    }}
                  />
                </div>
                <div>
                  <p className="font-medium">{result.title}</p>
                  <p className="text-xs text-muted-foreground">{result.category}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

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
