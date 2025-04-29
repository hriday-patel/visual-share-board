
import React from "react";
import { Pin, PinProps } from "@/components/Pin";
import { useMasonryLayout } from "@/hooks/useMasonryLayout";

interface RelatedPinsProps {
  pins: PinProps[];
}

export function RelatedPins({ pins }: RelatedPinsProps) {
  // Use our custom hook for masonry layout
  useMasonryLayout([pins], {
    delay: 300,
    itemSelector: '.masonry-item',
    spanRange: { min: 15, max: 60 }
  });

  if (pins.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-xl font-bold">More like this</h2>
      <div className="masonry-grid">
        {pins.map((relatedPin) => (
          <div key={relatedPin.id} className="masonry-item" style={{ "--span": "30" } as React.CSSProperties}>
            <Pin {...relatedPin} />
          </div>
        ))}
      </div>
    </div>
  );
}
