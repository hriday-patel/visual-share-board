
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Download, Heart, Share2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export interface PinProps {
  id: string;
  title: string;
  description?: string;
  image: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  saves?: number;
  category?: string;
}

export function Pin({ id, title, description, image, user, saves = 0, category }: PinProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(saves);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { toast } = useToast();
  
  const fallbackImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=400&q=80";

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSaved(!isSaved);
    setSaveCount(prev => isSaved ? prev - 1 : prev + 1);
    
    toast({
      title: isSaved ? "Pin removed from saved" : "Pin saved successfully",
      duration: 2000,
    });
  };

  const handleImageError = () => {
    console.log("Image failed to load:", image);
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '-')}.jpg`;
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

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description || "Check out this pin I found!",
        url: window.location.origin + `/pin/${id}`,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.origin + `/pin/${id}`);
        toast({
          title: "Link copied to clipboard",
          duration: 2000,
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/pin/${id}`);
      toast({
        title: "Link copied to clipboard",
        duration: 2000,
      });
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg">
      <Link to={`/pin/${id}`} className="block">
        <div className="relative">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          <img 
            src={imageError ? fallbackImage : image} 
            alt={title} 
            className={cn(
              "w-full object-cover transition duration-200",
              isImageLoading ? "opacity-0" : "opacity-100",
              "group-hover:brightness-75"
            )}
            loading="lazy"
            onError={handleImageError}
            onLoad={() => setIsImageLoading(false)}
            decoding="async"
          />
          
          <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex justify-end gap-2">
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
                onClick={handleSave}
              >
                <Heart 
                  className={`h-4 w-4 ${isSaved ? 'fill-pin-red text-pin-red' : ''}`} 
                />
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-auto">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full rounded-full bg-pin-red text-white hover:bg-pin-hover"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          <h3 className="line-clamp-1 font-medium">{title}</h3>
          {description && (
            <p className="line-clamp-1 text-sm text-muted-foreground">{description}</p>
          )}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-secondary">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-full w-full rounded-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs">{user.name}</span>
            </div>
            {saveCount > 0 && (
              <span className="text-xs text-muted-foreground">{saveCount} saves</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
