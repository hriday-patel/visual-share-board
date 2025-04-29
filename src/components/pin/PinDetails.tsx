
import React from "react";
import { PinUserAvatar } from "./PinUserAvatar";

interface PinDetailsProps {
  title: string;
  description?: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  saves?: number;
}

export function PinDetails({ title, description, user, saves = 0 }: PinDetailsProps) {
  return (
    <div className="p-2">
      <h3 className="line-clamp-1 font-medium">{title}</h3>
      {description && (
        <p className="line-clamp-1 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PinUserAvatar name={user.name} avatar={user.avatar} />
          <span className="text-xs">{user.name}</span>
        </div>
        {saves > 0 && (
          <span className="text-xs text-muted-foreground">{saves} saves</span>
        )}
      </div>
    </div>
  );
}
