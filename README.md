# Who's Who Laptop Game

A local-network “Who's Who?” style board game built with Node.js, Express, and a simple HTML/CSS/JavaScript front-end. Users connect locally to play an interactive game where they guess and identify characters.

## Table of Contents
1. [Project Overview](#project-overview)  
2. [File Structure](#file-structure)  
3. [Getting Started](#getting-started)  
4. [Running Locally](#running-locally)  
5. [Testing](#testing)  
6. [Documentation Generation](#documentation-generation)  
7. [Continuous Integration (GitHub Actions)](#continuous-integration-github-actions)  
8. [Additional Notes](#additional-notes)

## Project Overview
This application allows multiple players to join a “Who's Who?” style game over a local network. The server is built using Express, while the front end is plain HTML/CSS/JavaScript, enabling straightforward interactions without pushing data over the public internet.

**Key Features**  
- **Local-Only Server**: Binds to 127.0.0.1 or your private IP for LAN use.  
- **Dynamic Game Sessions**: Create, join, and leave game sessions.  
- **REST API**: Basic endpoints in Express to manage state.  
- **Simple Test Suite**: Uses Jest for testing.  
- **Automated Documentation**: Generates docs from JSDoc comments.  
- **GitHub Actions**: CI pipeline for testing and doc generation.

## File Structure

```
whos-who-laptop-game/
├── client/
│   ├── index.html            # Main entry point of the web app
│   ├── css/
│   │   └── style.css         # Styles
│   └── js/
│       ├── app.js            # Client-side application logic
│       └── game.js           # Game-specific logic (board rendering, events)
├── server/
│   ├── controllers/
│   │   └── gameController.js # Handle game logic and route actions
│   ├── data/
│   │   └── characters.json   # Sample character data for the game
│   ├── models/
│   │   ├── Game.js           # Game object, state management
│   │   └── Player.js         # Player object
│   ├── routes/
│   │   └── api.js            # Express routes for API endpoints
│   ├── utils/
│   │   └── logger.js         # Logging utility
│   └── index.js              # Application entry point (Express server)
├── tests/
│   └── sample.test.js        # Example tests using Jest + Supertest
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions pipeline
├── docs/                     # (Created after documentation generation)
├── jsdoc.config.json         # JSDoc configuration
├── package.json              # NPM manifest
└── README.md                 # Project documentation
```

## Getting Started

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/TomasOrtega/whos-who-laptop-game.git
   cd whos-who-laptop-game
   ```
2. **Install Dependencies**  
   ```bash
   npm install
   ```

## Running Locally

By default, the server will bind to `127.0.0.1` on port `3000`.  
1. **Start the Server**  
   ```bash
   npm start
   ```
2. **Access the Web App**  
   Open a browser and go to [http://127.0.0.1:3000/](http://127.0.0.1:3000/).  
   You'll see the game's main page (`client/index.html`).  

If you need to make the game available to other devices on your LAN, modify `server/index.js` to listen on your private IP (e.g., `192.168.x.x`) instead of `127.0.0.1`.

## Testing

We use **Jest** and **Supertest** for testing. Tests live in the `tests/` folder.

- **Run Tests**  
  ```bash
  npm test
  ```
- This command also generates coverage report by default (see the script in `package.json`).

## Documentation Generation

We use **JSDoc** to autogenerate documentation from code comments:

1. **Add JSDoc Comments**  
   In your `.js` files, add JSDoc-style comments:
   ```js
   /**
    * Starts a new Game instance.
    * @param {Object} config - Configuration for the game.
    */
   function startGame(config) {
     ...
   }
   ```

2. **Generate Docs**  
   ```bash
   npm run doc
   ```
   This will create a `docs/` folder containing HTML documentation. Open `docs/index.html` in a web browser to read your automatically generated docs.

## Continuous Integration (GitHub Actions)

A sample GitHub Actions workflow is located in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Whenever you push or open a pull request to `main` or `master`, GitHub Actions will:

1. **Install Dependencies**: `npm install`  
2. **Run Tests**: `npm test`  
3. **Generate Documentation**: `npm run doc`  
4. **(Optional) Upload Docs as Artifact** or deploy to GitHub Pages

If you choose to deploy to GitHub Pages, you can adjust the `ci.yml` (see the commented “Deploy to GitHub Pages” step).

## Additional Notes

- **Security**: By binding to `127.0.0.1`, the server is not exposed publicly. Use a firewall or further network safeguards if you change to a LAN IP.  
- **Logging**: Use `server/utils/logger.js` if you want to implement structured logs.
- **Contributions**: Issues or pull requests are welcome!  
- **License**: [Choose the license appropriate for your project.]

_Enjoy playing your local “Who's Who?” game!_