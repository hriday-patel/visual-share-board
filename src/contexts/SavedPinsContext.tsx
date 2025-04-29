
import React, { createContext, useContext, useState, useEffect } from "react";
import { PinProps } from "@/components/pin/Pin";

interface SavedPinsContextType {
  savedPinIds: Set<string>;
  isPinSaved: (id: string) => boolean;
  savePin: (pin: PinProps) => void;
  removePin: (id: string) => void;
  getSavedPins: () => PinProps[];
}

const SavedPinsContext = createContext<SavedPinsContextType | undefined>(undefined);

export function SavedPinsProvider({ children }: { children: React.ReactNode }) {
  const [savedPinIds, setSavedPinIds] = useState<Set<string>>(new Set());
  
  // Initialize from localStorage
  useEffect(() => {
    const savedIds = new Set<string>();
    Object.keys(localStorage)
      .filter(key => key.startsWith('pin_') && key.endsWith('_saved'))
      .forEach(key => {
        const id = key.replace('pin_', '').replace('_saved', '');
        savedIds.add(id);
      });
    
    setSavedPinIds(savedIds);
  }, []);
  
  const isPinSaved = (id: string): boolean => {
    return savedPinIds.has(id) || localStorage.getItem(`pin_${id}_saved`) !== null;
  };
  
  const savePin = (pin: PinProps) => {
    const newSavedIds = new Set(savedPinIds);
    newSavedIds.add(pin.id);
    setSavedPinIds(newSavedIds);
    
    localStorage.setItem(`pin_${pin.id}_saved`, "true");
    localStorage.setItem(`pin_${pin.id}_data`, JSON.stringify(pin));
  };
  
  const removePin = (id: string) => {
    const newSavedIds = new Set(savedPinIds);
    newSavedIds.delete(id);
    setSavedPinIds(newSavedIds);
    
    localStorage.removeItem(`pin_${id}_saved`);
    localStorage.removeItem(`pin_${id}_data`);
  };
  
  const getSavedPins = (): PinProps[] => {
    return Array.from(savedPinIds).map(id => {
      const pinData = localStorage.getItem(`pin_${id}_data`);
      return pinData ? JSON.parse(pinData) : null;
    }).filter(Boolean) as PinProps[];
  };
  
  return (
    <SavedPinsContext.Provider value={{ savedPinIds, isPinSaved, savePin, removePin, getSavedPins }}>
      {children}
    </SavedPinsContext.Provider>
  );
}

export function useSavedPins() {
  const context = useContext(SavedPinsContext);
  if (!context) {
    throw new Error("useSavedPins must be used within a SavedPinsProvider");
  }
  return context;
}
