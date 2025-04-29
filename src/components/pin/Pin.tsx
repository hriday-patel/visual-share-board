
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PinImage } from "./PinImage";
import { PinDetails } from "./PinDetails";

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

// Create a Set to track saved pin IDs
const savedPins = new Set<string>();

export function Pin({ id, title, description, image, user, saves = 0, category }: PinProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(saves);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  // Check if this pin has been saved previously
  useEffect(() => {
    if (localStorage.getItem(`pin_${id}_saved`)) {
      setIsSaved(true);
    } else {
      setIsSaved(savedPins.has(id));
    }
  }, [id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast({
        title: "Please log in to save pins",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    setSaveCount(prev => newSavedState ? prev + 1 : prev - 1);
    
    // Update saved pins in localStorage and global set
    if (newSavedState) {
      localStorage.setItem(`pin_${id}_saved`, "true");
      savedPins.add(id);
      
      // Also save the pin data for retrieval in the profile page
      const pinData: PinProps = {
        id, 
        title, 
        description, 
        image, 
        user,
        saves: saveCount,
        category
      };
      localStorage.setItem(`pin_${id}_data`, JSON.stringify(pinData));
    } else {
      localStorage.removeItem(`pin_${id}_saved`);
      localStorage.removeItem(`pin_${id}_data`);
      savedPins.delete(id);
    }
    
    toast({
      title: newSavedState ? "Pin saved successfully" : "Pin removed from saved",
      duration: 2000,
    });
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
        <PinImage
          image={image}
          title={title}
          isSaved={isSaved}
          onSave={handleSave}
          onShare={handleShare}
          onDownload={handleDownload}
        />
        
        <PinDetails
          title={title}
          description={description}
          user={user}
          saves={saveCount}
        />
      </Link>
    </div>
  );
}
