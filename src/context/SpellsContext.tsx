import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SpellsContextType {
  spells: any[];
  setSpells: (spells: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SpellsContext = createContext<SpellsContextType | undefined>(undefined);

export function SpellsProvider({ children }: { children: ReactNode }) {
  const [spells, setSpells] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SpellsContext.Provider value={{ spells, setSpells, isLoading, setIsLoading }}>
      {children}
    </SpellsContext.Provider>
  );
}

export function useSpells() {
  const context = useContext(SpellsContext);
  if (context === undefined) {
    throw new Error('useSpells must be used within a SpellsProvider');
  }
  return context;
}
