# D&D 5e Companion App

Este é um aplicativo React com TypeScript, criado para ser um assistente elegante e criativo para jogadores e mestres de Dungeons & Dragons 5ª edição. O foco do design é mobile first, garantindo uma experiência fluida e imersiva em dispositivos móveis.

## Table of Contents

- [Getting Started](#getting-started)
- [Design e Experiência Mobile First](#design-e-experiência-mobile-first)
- [Folder Structure](#folder-structure)
- [Scripts](#scripts)
- [License](#license)

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate into the project directory:
   ```
   cd my-react-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and go to `http://localhost:3000` to see the application in action.

## Design e Experiência Mobile First

O app foi projetado com uma interface inspirada em grimórios e pergaminhos, utilizando tons escuros, detalhes dourados e tipografia temática para criar uma atmosfera imersiva de fantasia medieval. Os principais pontos do design:

- **Mobile First:** Layouts responsivos, navegação simplificada por abas e menus expansíveis.
- **Elementos Visuais:** Ícones temáticos (dados, pergaminhos, dragões), botões arredondados e animações suaves.
- **Acessibilidade:** Contraste elevado, fontes legíveis e navegação por toque otimizada.
- **Componentes:** Fichas de personagem, rolagem de dados, consulta rápida de magias, monstros e itens.
- **Personalização:** Temas claro/escuro e possibilidade de salvar favoritos.

## Folder Structure

```
my-react-app
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── components          # Reusable components
│   │   └── App.tsx        # Main App component
│   ├── hooks               # Custom hooks
│   ├── pages               # Page components
│   ├── styles              # Global styles
│   │   └── global.css      # Global CSS styles
│   ├── utils               # Utility functions
│   └── index.tsx          # Entry point of the application
├── package.json            # NPM configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Scripts

- `npm start`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm test`: Runs the test suite.

## License

This project is licensed under the MIT License.