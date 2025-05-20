import React, { useState, useEffect } from 'react';
import SpellModal from '../components/SpellModal';
import '../styles/SpellsPage.css';
import { useDnDAPI, Spell } from '../hooks/useDnDAPI';
import { useSpells } from '../context/SpellsContext';

const SpellsPage: React.FC = () => {
  const { fetchSpells, fetchSpellDetails, formatSpell } = useDnDAPI();
  const { spells, setSpells, isLoading, setIsLoading } = useSpells();
  const [spellsByCircle, setSpellsByCircle] = useState<{ [level: number]: Spell[] }>({});
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<'all' | number>('all');
  const [selectedClass, setSelectedClass] = useState<'all' | string>('all');

  // Obter todas as classes disponíveis a partir das magias carregadas
  const allClasses = Array.from(
    new Set(
      Object.values(spellsByCircle)
        .flat()
        .flatMap(spell => spell.classes.map(c => c.name))
    )
  ).sort();

  // Função para adaptar o spell da API para o formato do SpellModal
  const adaptSpellForModal = (spell: Spell | null) => {
    if (!spell) return null;
    return {
      name: spell.name,
      school: spell.school.name,
      level: spell.level,
      castingTime: spell.casting_time,
      range: spell.range,
      components: spell.components.join(', ') + (spell.material ? ` (${spell.material})` : ''),
      duration: spell.duration,
      description: spell.desc,
      classes: spell.classes.map(c => c.name)
    };
  };

  useEffect(() => {
    const loadSpells = async () => {
      // Se já temos magias no contexto, apenas organize por círculo
      if (spells.length > 0) {
        const byCircle: { [level: number]: Spell[] } = {};
        spells.forEach(spell => {
          if (!byCircle[spell.level]) byCircle[spell.level] = [];
          byCircle[spell.level].push(spell);
        });
        // Ordenar alfabeticamente dentro de cada círculo
        Object.keys(byCircle).forEach(level => {
          byCircle[Number(level)] = byCircle[Number(level)].sort((a, b) => 
            a.name.localeCompare(b.name)
          );
        });
        setSpellsByCircle(byCircle);
        setIsLoading(false);
        return;
      }

      // Se não temos magias no contexto, carregue-as
      setIsLoading(true);
      const spellList = await fetchSpells();
      const detailsPromises = spellList.map((s: any) => fetchSpellDetails(s.index));
      const details = await Promise.all(detailsPromises);
      const formatted = details.filter(Boolean).map(formatSpell);
      
      // Armazene no contexto
      setSpells(formatted);
      
      // Organize por círculo
      const byCircle: { [level: number]: Spell[] } = {};
      formatted.forEach(spell => {
        if (!byCircle[spell.level]) byCircle[spell.level] = [];
        byCircle[spell.level].push(spell);
      });
      
      // Ordene alfabeticamente dentro de cada círculo
      Object.keys(byCircle).forEach(level => {
        byCircle[Number(level)] = byCircle[Number(level)].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
      });
      
      setSpellsByCircle(byCircle);
      setIsLoading(false);
    };
    
    loadSpells();
  }, [fetchSpells, fetchSpellDetails, formatSpell, setSpells, setIsLoading, spells]);

  // Obter todos os círculos disponíveis ordenados
  const circles = Object.keys(spellsByCircle)
    .map(Number)
    .sort((a, b) => a - b);

  // Filtrar magias conforme busca, círculo e classe selecionada
  const getFilteredSpells = () => {
    let filtered: { [level: number]: Spell[] } = {};
    const circlesToShow = selectedCircle === 'all' ? circles : [selectedCircle];
    circlesToShow.forEach(level => {
      filtered[level] = (spellsByCircle[level] || []).filter(spell => {
        const matchesName = spell.name.toLowerCase().includes(search.toLowerCase());
        const matchesClass = selectedClass === 'all' || spell.classes.some(c => c.name === selectedClass);
        return matchesName && matchesClass;
      });
    });
    return filtered;
  };

  const filteredSpellsByCircle = getFilteredSpells();

  const handleSpellClick = async (spell: Spell) => {
    setModalLoading(true);
    const details = await fetchSpellDetails(spell.index);
    setSelectedSpell(formatSpell(details));
    setModalLoading(false);
  };

  return (
    <div className="spells-container mobile-no-scroll">
      <div className="spells-filters-row">
        <input
          type="text"
          placeholder="Buscar magia..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="spells-filter-input"
        />
        <select
          value={selectedCircle}
          onChange={e => setSelectedCircle(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="spells-filter-select"
        >
          <option value="all">Círculo</option>
          {circles.map(level => (
            <option key={level} value={level}>{level === 0 ? 'Truques' : `${level}º`}</option>
          ))}
        </select>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="spells-filter-select"
        >
          <option value="all">Classe</option>
          {allClasses.map(className => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>Carregando magias...</div>
      ) : (
        <div className="spells-circles-grid">
          {Object.keys(filteredSpellsByCircle).map(circle => (
            filteredSpellsByCircle[Number(circle)].length > 0 && (
              <div key={circle} className="spells-circle-grid">
                <h2 className="circle-title-grid">
                  {circle === '0' ? 'Truques' : `${circle}º Círculo`}
                </h2>
                <div className="spells-list-carousel">
                  {filteredSpellsByCircle[Number(circle)].map((spell) => (
                    <div
                      key={spell.index}
                      className="spell-card-carousel"
                      onClick={() => handleSpellClick(spell)}
                      title="Toque para ver detalhes da magia"
                      tabIndex={0}
                      role="button"
                      aria-label={`Abrir detalhes da magia ${spell.name}`}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSpellClick(spell); }}
                    >
                      <span className="spell-card-name">{spell.name}</span>
                      <span className="spell-card-school">{spell.school.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
      <SpellModal 
        spell={modalLoading ? null : adaptSpellForModal(selectedSpell)} 
        onClose={() => setSelectedSpell(null)} 
      />
    </div>
  );
};

export default SpellsPage;
