import React, { useState } from 'react';
import CharacterForm from '../components/CharacterForm';
import { useCharacter } from '../context/CharacterContext';
import '../styles/CharactersPage.css';

const CharactersPage: React.FC = () => {
  const { characters, deleteCharacter, setSelectedCharacter } = useCharacter();
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<any>(null);

  const handleEditCharacter = (character: any) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingCharacter(null);
  };

  return (
    <div className="characters-container">
      {showForm ? (
        <CharacterForm 
          onSubmit={handleFormSubmit}
          initialCharacter={editingCharacter}
        />
      ) : (
        <>
          <div className="characters-header">
            <h1>Meus Personagens</h1>
            <button 
              className="new-character-button"
              onClick={() => setShowForm(true)}
            >
              Novo Personagem
            </button>
          </div>

          <div className="characters-grid">
            {characters.map(character => (
              <div key={character.id} className="character-card">
                <h2>{character.name}</h2>
                <p>{character.race} {character.class}</p>
                <p>Nível {character.level}</p>
                <div className="character-card-actions">
                  <button 
                    onClick={() => handleEditCharacter(character)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => deleteCharacter(character.id)}
                    className="delete-button"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {characters.length === 0 && (
            <div className="no-characters">
              <p>Você ainda não tem personagens criados.</p>
              <p>Clique em "Novo Personagem" para começar!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CharactersPage;
