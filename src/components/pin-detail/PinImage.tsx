
import React from "react";

interface PinImageProps {
  image: string;
  title: string;
}

export function PinImage({ image, title }: PinImageProps) {
  return (
    <div className="overflow-hidden rounded-lg shadow-lg">
      <img 
        src={image} 
        alt={title}
        className="w-full" 
      />
    </div>
  );
}
