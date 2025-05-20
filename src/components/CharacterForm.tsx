import React, { useState, useEffect } from 'react';
import { useCharacter, Character } from '../context/CharacterContext';
import { useDnDAPI } from '../hooks/useDnDAPI';
import '../styles/CharacterForm.css';

interface CharacterFormProps {
  onSubmit?: () => void;
  initialCharacter?: Character;
}

type CharacterFormData = Partial<Character> & {
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  hitPoints: {
    maximum: number;
    current: number;
    temporary: number;
  };
};

const CharacterForm: React.FC<CharacterFormProps> = ({ onSubmit, initialCharacter }) => {
  const { addCharacter, updateCharacter } = useCharacter();
  const { fetchClasses, fetchRaces, fetchBackgrounds } = useDnDAPI();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState({
    classes: [] as any[],
    races: [] as any[],
    backgrounds: [] as any[]
  });

  // Initialize form data with default values or initial character
  const [formData, setFormData] = useState<CharacterFormData>({
    name: initialCharacter?.name || '',
    race: initialCharacter?.race || '',
    class: initialCharacter?.class || '',
    level: initialCharacter?.level || 1,
    background: initialCharacter?.background || '',
    alignment: initialCharacter?.alignment || 'Neutro',
    experience: initialCharacter?.experience || 0,
    attributes: initialCharacter?.attributes || {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    hitPoints: initialCharacter?.hitPoints || {
      maximum: 0,
      current: 0,
      temporary: 0
    },
    skills: initialCharacter?.skills || {},
    savingThrows: initialCharacter?.savingThrows || {},
    equipment: initialCharacter?.equipment || [],
    spells: initialCharacter?.spells || {},
    features: initialCharacter?.features || []
  });

  // Load options from API
  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        const [classesData, racesData, backgroundsData] = await Promise.all([
          fetchClasses(),
          fetchRaces(),
          fetchBackgrounds()
        ]);

        setOptions({
          classes: classesData,
          races: racesData,
          backgrounds: backgroundsData
        });
      } catch (error) {
        setError('Erro ao carregar opções. Por favor, tente novamente.');
        console.error('Error loading options:', error);
      }
      setLoading(false);
    };

    loadOptions();
  }, [fetchClasses, fetchRaces, fetchBackgrounds]);

  // Calculate proficiency bonus based on level
  const calculateProficiencyBonus = (level: number) => {
    return Math.floor((level - 1) / 4) + 2;
  };

  // Calculate ability modifier
  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  // Handle form input changes
  const handleChange = (
    field: string,
    value: any,
    section?: 'attributes' | 'hitPoints'
  ) => {
    setFormData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Update HP when class, level, or constitution changes
  useEffect(() => {
    if (formData.class && formData.level && formData.attributes?.constitution) {
      const selectedClass = options.classes.find(c => c.index === formData.class);
      if (selectedClass) {
        const conModifier = calculateModifier(formData.attributes.constitution);
        const hitDie = selectedClass.hit_die;
        // First level gets maximum HP
        const firstLevelHP = hitDie + conModifier;
        // Subsequent levels roll or take average
        const additionalLevels = formData.level - 1;
        const averagePerLevel = Math.floor(hitDie / 2) + 1 + conModifier;
        const totalHP = firstLevelHP + (additionalLevels * averagePerLevel);
        
        handleChange('maximum', totalHP, 'hitPoints');
        if (!initialCharacter) {
          handleChange('current', totalHP, 'hitPoints');
        }
      }
    }
  }, [formData.class, formData.level, formData.attributes?.constitution, options.classes]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.race || !formData.class) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const character: Character = {
      ...formData,
      id: initialCharacter?.id || Date.now().toString()
    } as Character;

    try {
      if (initialCharacter) {
        updateCharacter(character.id, character);
      } else {
        addCharacter(character);
      }
      if (onSubmit) onSubmit();
    } catch (error) {
      setError('Erro ao salvar o personagem. Por favor, tente novamente.');
      console.error('Error saving character:', error);
    }
  };

  if (loading) {
    return <div className="loading">Carregando opções...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => window.location.reload()}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="character-form">
      <div className="form-section">
        <h2>Informações Básicas</h2>
        <div className="form-group">
          <label htmlFor="name">Nome do Personagem</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="race">Raça</label>
          <select
            id="race"
            value={formData.race}
            onChange={(e) => handleChange('race', e.target.value)}
            required
          >
            <option value="">Selecione uma raça</option>
            {options.races.map(race => (
              <option key={race.index} value={race.index}>
                {race.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="class">Classe</label>
          <select
            id="class"
            value={formData.class}
            onChange={(e) => handleChange('class', e.target.value)}
            required
          >
            <option value="">Selecione uma classe</option>
            {options.classes.map(classOption => (
              <option key={classOption.index} value={classOption.index}>
                {classOption.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="level">Nível</label>
          <input
            type="number"
            id="level"
            value={formData.level}
            onChange={(e) => handleChange('level', parseInt(e.target.value))}
            min="1"
            max="20"
            required
          />
          <span className="helper-text">
            Bônus de Proficiência: +{calculateProficiencyBonus(formData.level || 1)}
          </span>
        </div>
      </div>

      <div className="form-section">
        <h2>Atributos</h2>
        <div className="attributes-grid">
          {Object.entries(formData.attributes || {}).map(([attr, value]) => (
            <div key={attr} className="attribute-group">
              <label htmlFor={attr}>
                {attr.charAt(0).toUpperCase() + attr.slice(1)}
              </label>
              <input
                type="number"
                id={attr}
                value={value}
                onChange={(e) => handleChange(attr, parseInt(e.target.value), 'attributes')}
                min="1"
                max="20"
              />
              <span className="modifier">
                {calculateModifier(value) >= 0 ? '+' : ''}{calculateModifier(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h2>Pontos de Vida</h2>
        <div className="hp-grid">
          <div className="form-group">
            <label htmlFor="maxHP">HP Máximo</label>
            <input
              type="number"
              id="maxHP"
              value={formData.hitPoints?.maximum || 0}
              onChange={(e) => handleChange('maximum', parseInt(e.target.value), 'hitPoints')}
              min="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentHP">HP Atual</label>
            <input
              type="number"
              id="currentHP"
              value={formData.hitPoints?.current || 0}
              onChange={(e) => handleChange('current', parseInt(e.target.value), 'hitPoints')}
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tempHP">HP Temporário</label>
            <input
              type="number"
              id="tempHP"
              value={formData.hitPoints?.temporary || 0}
              onChange={(e) => handleChange('temporary', parseInt(e.target.value), 'hitPoints')}
              min="0"
            />
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="submit-button">
        {initialCharacter ? 'Atualizar Personagem' : 'Criar Personagem'}
      </button>
    </form>
  );
};

export default CharacterForm;
