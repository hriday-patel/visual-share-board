
import React, { useEffect } from "react";
import { Pin, PinProps } from "@/components/Pin";

interface RelatedPinsProps {
  pins: PinProps[];
}

export function RelatedPins({ pins }: RelatedPinsProps) {
  useEffect(() => {
    // Set image heights for masonry layout
    setTimeout(() => {
      const pinElements = document.querySelectorAll('.masonry-item');
      pinElements.forEach((pin) => {
        const randomSpan = Math.floor(Math.random() * 45) + 15; // between 15-60
        pin.setAttribute('style', `--span: ${randomSpan}`);
      });
    }, 300);
  }, [pins]);

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
