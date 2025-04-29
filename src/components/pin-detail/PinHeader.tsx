
import React from "react";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PinHeaderProps {
  user: {
    name: string;
    avatar?: string;
  };
  saves?: number;
  isSaved: boolean;
  onSave: () => void;
  onShare: () => void;
}

export function PinHeader({ user, saves, isSaved, onSave, onShare }: PinHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-secondary">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-full w-full rounded-full object-cover" 
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          {saves && <p className="text-sm text-muted-foreground">{saves} saves</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`rounded-full ${isSaved ? 'bg-pin-red text-white hover:bg-pin-hover' : ''}`}
          onClick={onSave}
        >
          <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
