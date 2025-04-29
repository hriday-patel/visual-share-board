
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PinContentProps {
  title: string;
  description?: string;
  category?: string;
  onDownload: () => void;
}

export function PinContent({ title, description, category, onDownload }: PinContentProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {category && (
          <div className="rounded-full bg-secondary px-3 py-1 text-sm">
            {category}
          </div>
        )}
      </div>
      
      <Button 
        className="mt-auto w-full bg-pin-red hover:bg-pin-hover"
        onClick={onDownload}
      >
        <Download className="mr-2 h-4 w-4" /> Download Image
      </Button>
    </div>
  );
}
