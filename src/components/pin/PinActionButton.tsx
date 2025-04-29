
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface PinActionButtonProps {
  icon: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PinActionButton({ 
  icon: Icon, 
  onClick, 
  isActive = false, 
  className = "",
  children
}: PinActionButtonProps) {
  return (
    <Button 
      variant="secondary" 
      size={children ? "sm" : "icon"} 
      className={`${children ? "rounded-full" : "h-8 w-8 rounded-full"} bg-white/90 shadow-sm hover:bg-white ${className}`}
      onClick={onClick}
    >
      <Icon className={`${children ? "mr-2 " : ""}h-4 w-4 ${isActive ? 'fill-pin-red text-pin-red' : ''}`} />
      {children}
    </Button>
  );
}
