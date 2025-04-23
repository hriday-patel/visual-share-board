
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, Heart, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPinById, getPins } from "@/data/pins";
import { Pin, PinProps } from "@/components/Pin";
import { useToast } from "@/components/ui/use-toast";

const PinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState<PinProps | null>(null);
  const [relatedPins, setRelatedPins] = useState<PinProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundPin = getPinById(id);
      if (foundPin) {
        setPin(foundPin);
        
        // Get related pins (same category)
        const allPins = getPins();
        const related = allPins
          .filter(p => p.category === foundPin.category && p.id !== id)
          .slice(0, 8);
        setRelatedPins(related);
        
        // Reset scroll position
        window.scrollTo(0, 0);
      } else {
        navigate("/not-found");
      }
    }
  }, [id, navigate]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Pin removed from saved" : "Pin saved successfully",
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

  if (!pin) {
    return (
      <div className="container mx-auto flex items-center justify-center p-8">
        <p>Loading...</p>
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
