import React from 'react';
import '../styles/NavButton.css';

interface NavButtonProps {
    icon: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
    <button
        className={`nav-btn${active ? ' active' : ''}`}
        onClick={onClick}
    >
        <span>{icon}</span>
        <span className="nav-btn-label">{label}</span>
    </button>
);

export default NavButton;
