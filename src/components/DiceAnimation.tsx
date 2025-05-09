import React from 'react';
import '../styles/DiceAnimation.css';

interface DiceAnimationProps {
    sides: number;
    count: number;
}

const DiceAnimation: React.FC<DiceAnimationProps> = ({ sides, count }) => (
    <div className="dice-animation-row">
        {Array.from({ length: count }).map((_, i) => (
            <DiceFace key={i} sides={sides} />
        ))}
    </div>
);

const DiceFace: React.FC<{ sides: number }> = ({ sides }) => {
    const label = ['d4','d6','d8','d10','d12','d20','d100'].includes('d'+sides) ? 'd'+sides : '?';
    return <span className="dice-rolling">{label}</span>;
};

export default DiceAnimation;
