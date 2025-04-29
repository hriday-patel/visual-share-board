
import React from "react";
import { Heart, Share2, Download } from "lucide-react";
import { PinActionButton } from "./PinActionButton";

interface PinImageOverlayProps {
  isSaved: boolean;
  onSave: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
}

export function PinImageOverlay({ 
  isSaved, 
  onSave, 
  onShare, 
  onDownload 
}: PinImageOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100">
      <div className="flex justify-end gap-2">
        <PinActionButton 
          icon={Heart}
          onClick={onSave}
          isActive={isSaved}
        />
        <PinActionButton 
          icon={Share2}
          onClick={onShare}
        />
      </div>
      
      <div className="mt-auto">
        <PinActionButton 
          icon={Download}
          onClick={onDownload}
          className="w-full bg-pin-red text-white hover:bg-pin-hover"
        >
          Download
        </PinActionButton>
      </div>
    </div>
  );
}
