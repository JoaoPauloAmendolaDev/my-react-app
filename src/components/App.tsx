import React, { useState } from 'react';
import NavButton from './NavButton';
import RollPage from '../pages/RollPage';
import SpellsPage from '../pages/SpellsPage';
import MonstersPage from '../pages/MonstersPage';
import CharactersPage from '../pages/CharactersPage';
import MorePage from '../pages/MorePage';
import { SpellsProvider } from '../context/SpellsContext';
import '../styles/App.css';

const pages = [
    { key: 'roll', icon: '🎲', label: 'Rolagem', component: <RollPage /> },
    { key: 'spells', icon: '📜', label: 'Magias', component: <SpellsPage /> },
    { key: 'monsters', icon: '🐉', label: 'Monstros', component: <MonstersPage /> },
    { key: 'characters', icon: '🧙‍♂️', label: 'Fichas', component: <CharactersPage /> },
    { key: 'more', icon: '⚙️', label: 'Mais', component: <MorePage /> }
];

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('roll');
    const current = pages.find(p => p.key === currentPage);

    return (
        <SpellsProvider>
            <img
                className="background-dragon"
                src="https://sm.ign.com/ign_pt/feature/e/every-drag/every-dragon-in-game-of-thrones-house-of-the-dragon_zmfu.jpg" 
                alt="Dragão decorativo"
                aria-hidden="true"
            />
            <div className="container fade-in">
                <Header />
                <main className="main-content">
                    <div className="main-card">
                        {current?.component}
                    </div>
                </main>
                <BottomNav
                    pages={pages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </SpellsProvider>
    );
};

// Header component
const Header: React.FC = () => (
    <header className="app-header">
        <img
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f409.svg"
            alt="Dragão"
            className="app-logo"
        />
        <h1 className="app-title">D&D 5e Companion</h1>
    </header>
);

// Bottom navigation component
interface BottomNavProps {
    pages: typeof pages;
    currentPage: string;
    setCurrentPage: (key: string) => void;
}
const BottomNav: React.FC<BottomNavProps> = ({ pages, currentPage, setCurrentPage }) => (
    <nav className="app-nav">
        {pages.map(page => (
            <NavButton
                key={page.key}
                icon={page.icon}
                label={page.label}
                active={currentPage === page.key}
                onClick={() => setCurrentPage(page.key)}
            />
        ))}
    </nav>
);

export default App;