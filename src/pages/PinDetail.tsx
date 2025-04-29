import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, Heart, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pin, PinProps } from "@/components/Pin";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { searchPhotos, unsplashPhotoToPin } from "@/services/unsplash";

const PinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState<PinProps | null>(null);
  const [relatedPins, setRelatedPins] = useState<PinProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPinDetails = async () => {
        setIsLoading(true);
        
        try {
          // First check if we have this pin saved in localStorage
          const savedPinData = localStorage.getItem(`pin_${id}_data`);
          let currentPin: PinProps | null = null;
          
          if (savedPinData) {
            currentPin = JSON.parse(savedPinData);
          } else {
            // If not in localStorage, fetch from Unsplash API
            // For this example, we'll search for the ID
            // In a real app, you'd use a different endpoint to get a specific photo by ID
            const photos = await searchPhotos(id, 1, 1);
            if (photos.length > 0) {
              currentPin = unsplashPhotoToPin(photos[0]);
            }
          }
          
          if (currentPin) {
            setPin(currentPin);
            
            // Check if this pin has been saved previously
            setIsSaved(localStorage.getItem(`pin_${id}_saved`) !== null);
            
            // Get related pins based on category or title
            const category = currentPin.category || currentPin.title.split(' ')[0];
            const related = await searchPhotos(category, 1, 8);
            setRelatedPins(related.map(unsplashPhotoToPin).filter(p => p.id !== id));
          } else {
            navigate("/not-found");
          }
        } catch (error) {
          console.error("Error fetching pin details:", error);
          toast({
            title: "Error loading pin",
            description: "Please try again later",
            variant: "destructive"
          });
          navigate("/not-found");
        } finally {
          setIsLoading(false);
          
          // Reset scroll position
          window.scrollTo(0, 0);
          
          // Set image heights for masonry layout
          setTimeout(() => {
            const pinElements = document.querySelectorAll('.masonry-item');
            pinElements.forEach((pin) => {
              const randomSpan = Math.floor(Math.random() * 45) + 15; // between 15-60
              pin.setAttribute('style', `--span: ${randomSpan}`);
            });
          }, 300);
        }
      };
      
      fetchPinDetails();
    }
  }, [id, navigate, toast]);

  const handleSave = () => {
    if (!user) {
      toast({
        title: "Please log in to save pins",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    if (!pin) return;
    
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    // Update saved pins in localStorage
    if (newSavedState) {
      localStorage.setItem(`pin_${id}_saved`, "true");
      localStorage.setItem(`pin_${id}_data`, JSON.stringify(pin));
    } else {
      localStorage.removeItem(`pin_${id}_saved`);
      localStorage.removeItem(`pin_${id}_data`);
    }
    
    toast({
      title: newSavedState ? "Pin saved successfully" : "Pin removed from saved",
      duration: 2000,
    });
  };

  const handleDownload = async () => {
    if (!pin) return;
    
    try {
      const response = await fetch(pin.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pin.title.replace(/\s+/g, '-')}.jpg`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Image downloaded successfully",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to download image",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleShare = () => {
    if (!pin) return;
    
    if (navigator.share) {
      navigator.share({
        title: pin.title,
        text: pin.description || "Check out this pin I found!",
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          duration: 2000,
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!pin) {
    return (
      <div className="container mx-auto flex items-center justify-center p-8">
        <p>Pin not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 flex items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img 
              src={pin.image} 
              alt={pin.title}
              className="w-full" 
            />
          </div>
        </div>
        
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-secondary">
                  {pin.user.avatar ? (
                    <img 
                      src={pin.user.avatar} 
                      alt={pin.user.name} 
                      className="h-full w-full rounded-full object-cover" 
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-medium">
                      {pin.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{pin.user.name}</p>
                  {pin.saves && <p className="text-sm text-muted-foreground">{pin.saves} saves</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`rounded-full ${isSaved ? 'bg-pin-red text-white hover:bg-pin-hover' : ''}`}
                  onClick={handleSave}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <h1 className="mt-6 text-2xl font-bold">{pin.title}</h1>
            {pin.description && (
              <p className="mt-2 text-muted-foreground">{pin.description}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {pin.category && (
              <div className="rounded-full bg-secondary px-3 py-1 text-sm">
                {pin.category}
              </div>
            )}
          </div>
          
          <Button 
            className="mt-auto w-full bg-pin-red hover:bg-pin-hover"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" /> Download Image
          </Button>
        </div>
      </div>
      
      {relatedPins.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-bold">More like this</h2>
          <div className="masonry-grid">
            {relatedPins.map((relatedPin) => (
              <div key={relatedPin.id} className="masonry-item" style={{ "--span": "30" } as React.CSSProperties}>
                <Pin {...relatedPin} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PinDetail;
