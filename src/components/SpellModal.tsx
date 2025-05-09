import React from 'react';
import '../styles/SpellModal.css';

interface SpellModalProps {
    spell: {
        name: string;
        school: string;
        level: number;
        castingTime: string;
        range: string;
        components: string;
        duration: string;
        description: string[];
        classes: string[];
    } | null;
    onClose: () => void;
}

const SpellModal: React.FC<SpellModalProps> = ({ spell, onClose }) => {
    if (!spell) return null;

    return (
        <div className="spell-modal-overlay" onClick={onClose}>
            <div className="spell-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2 className="spell-modal-title">{spell.name}</h2>
                <div className="spell-meta">
                    <p className="spell-level">
                        {spell.level === 0 ? 'Truque' : `${spell.level}º nível`} de {spell.school}
                    </p>
                </div>
                <div className="spell-info">
                    <p><strong>Tempo de Conjuração:</strong> {spell.castingTime}</p>
                    <p><strong>Alcance:</strong> {spell.range}</p>
                    <p><strong>Componentes:</strong> {spell.components}</p>
                    <p><strong>Duração:</strong> {spell.duration}</p>
                </div>
                <div className="spell-description">
                    {spell.description.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
                <div className="spell-classes">
                    <strong>Classes:</strong> {spell.classes.join(', ')}
                </div>
            </div>
        </div>
    );
};

export default SpellModal;
