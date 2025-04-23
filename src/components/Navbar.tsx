
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Command } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem("pinterest-user");
    setIsLoggedIn(!!user);
  }, [location]);

  useEffect(() => {
    // Register keyboard shortcut for command palette
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        navigate('/search');
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("pinterest-user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-pin-red">PinClone</span>
          </Link>
          <nav className="hidden md:flex gap-4 ml-4">
            <Link to="/" className="font-medium hover:text-pin-red transition-colors">
              Home
            </Link>
            <Link to="/explore" className="font-medium hover:text-pin-red transition-colors">
              Explore
            </Link>
            {isLoggedIn && (
              <Link to="/create" className="font-medium hover:text-pin-red transition-colors">
                Create
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm hidden md:flex">
            <Input
              type="search"
              placeholder="Search pins... (⌘K)"
              className="pr-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center"
            onClick={() => navigate('/search')}
          >
            <Command className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline-flex">⌘K</span>
          </Button>
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="flex gap-2">
              <Link to="/profile">
                <Button variant="ghost" className="rounded-full">Profile</Button>
              </Link>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="rounded-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" className="rounded-full">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-pin-red hover:bg-pin-hover rounded-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
