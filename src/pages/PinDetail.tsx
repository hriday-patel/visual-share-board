
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PinProps } from "@/components/Pin";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { searchPhotos, unsplashPhotoToPin } from "@/services/unsplash";
import { PinImage } from "@/components/pin-detail/PinImage";
import { PinHeader } from "@/components/pin-detail/PinHeader";
import { PinContent } from "@/components/pin-detail/PinContent";
import { RelatedPins } from "@/components/pin-detail/RelatedPins";

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
          <PinImage image={pin.image} title={pin.title} />
        </div>
        
        <div className="flex flex-col space-y-6">
          <PinHeader 
            user={pin.user}
            saves={pin.saves}
            isSaved={isSaved}
            onSave={handleSave}
            onShare={handleShare}
          />
          
          <PinContent
            title={pin.title}
            description={pin.description}
            category={pin.category}
            onDownload={handleDownload}
          />
        </div>
      </div>
      
      <RelatedPins pins={relatedPins} />
    </div>
  );
};

export default PinDetail;
