import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { SpellsProvider } from './context/SpellsContext';
import { CharacterProvider } from './context/CharacterContext';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SpellsProvider>
      <CharacterProvider>
        <App />
      </CharacterProvider>
    </SpellsProvider>
  </React.StrictMode>
);