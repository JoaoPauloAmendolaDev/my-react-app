import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;
  experience: number;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: {
    [key: string]: {
      proficient: boolean;
      value: number;
    };
  };
  hitPoints: {
    maximum: number;
    current: number;
    temporary: number;
  };
  proficiencyBonus: number;
  savingThrows: {
    [key: string]: boolean;
  };
  equipment: Array<{
    item: string;
    quantity: number;
  }>;
  spells: {
    [level: number]: string[]; // spell IDs por nível
  };
  features: string[];
}

interface CharacterContextType {
  characters: Character[];
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, character: Character) => void;
  deleteCharacter: (id: string) => void;
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character | null) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const addCharacter = (character: Character) => {
    setCharacters([...characters, character]);
  };

  const updateCharacter = (id: string, updatedCharacter: Character) => {
    setCharacters(characters.map(char => 
      char.id === id ? updatedCharacter : char
    ));
  };

  const deleteCharacter = (id: string) => {
    setCharacters(characters.filter(char => char.id !== id));
  };

  return (
    <CharacterContext.Provider 
      value={{ 
        characters, 
        addCharacter, 
        updateCharacter, 
        deleteCharacter,
        selectedCharacter,
        setSelectedCharacter
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}
