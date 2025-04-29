
import React from "react";

interface PinUserAvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
}

export function PinUserAvatar({ name, avatar, size = "sm" }: PinUserAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };
  
  const sizeClass = sizeClasses[size];
  
  return (
    <div className={`${sizeClass} rounded-full bg-secondary`}>
      {avatar ? (
        <img 
          src={avatar} 
          alt={name} 
          className="h-full w-full rounded-full object-cover"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-medium">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
