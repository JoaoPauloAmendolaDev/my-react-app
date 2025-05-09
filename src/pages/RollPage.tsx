import React, { useState } from 'react';
import DiceAnimation from '../components/DiceAnimation';
import '../styles/RollPage.css';

const diceTypes = [4, 6, 8, 10, 12, 20, 100];

const RollPage: React.FC = () => {
    const [sides, setSides] = useState(20);
    const [count, setCount] = useState(1);
    const [results, setResults] = useState<number[]>([]);
    const [rolling, setRolling] = useState(false);

    const rollDice = () => {
        setRolling(true);
        setTimeout(() => {
            const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
            setResults(rolls);
            setRolling(false);
        }, 900);
    };

    return (
        <div className="roll-page-container">
            <h2 className="roll-title">Rolagem de Dados</h2>
            
            <div className="roll-controls">
                <label className="roll-control-label">
                    Tipo de dado:
                    <select 
                        className="roll-select"
                        value={sides} 
                        onChange={e => setSides(Number(e.target.value))}
                    >
                        {diceTypes.map(type => (
                            <option key={type} value={type}>d{type}</option>
                        ))}
                    </select>
                </label>

                <label className="roll-control-label">
                    Quantidade:
                    <input 
                        type="number" 
                        className="roll-input"
                        min={1} 
                        max={20} 
                        value={count} 
                        onChange={e => setCount(Number(e.target.value))}
                    />
                </label>

                <button 
                    className="roll-button"
                    onClick={rollDice} 
                    disabled={rolling}
                >
                    Rolar Dados
                </button>
            </div>

            <div className="dice-animation-container">
                {rolling && <DiceAnimation sides={sides} count={count} />}
            </div>

            {results.length > 0 && !rolling && (
                <div className="roll-result">
                    <div className="roll-result-values">
                        {results.map((r, i) => (
                            <span key={i}>{r}</span>
                        ))}
                    </div>
                    <div className="roll-result-sum">
                        Total: {results.reduce((a, b) => a + b, 0)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RollPage;
