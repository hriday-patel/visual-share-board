
import React, { useState } from "react";
import { PinImageOverlay } from "./PinImageOverlay";

interface PinImageProps {
  image: string;
  title: string;
  isSaved: boolean;
  onSave: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
}

export function PinImage({ 
  image, 
  title, 
  isSaved, 
  onSave, 
  onShare, 
  onDownload 
}: PinImageProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=400&q=80";
  
  const handleImageError = () => {
    console.log("Image failed to load:", image);
    setImageError(true);
  };

  return (
    <div className="relative">
      <img 
        src={imageError ? fallbackImage : image} 
        alt={title} 
        className="w-full object-cover transition duration-200 group-hover:brightness-75"
        loading="lazy"
        onError={handleImageError}
      />
      
      <PinImageOverlay 
        isSaved={isSaved}
        onSave={onSave}
        onShare={onShare}
        onDownload={onDownload}
      />
    </div>
  );
}
