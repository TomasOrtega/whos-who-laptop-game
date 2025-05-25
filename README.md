# Who's Who Laptop Game

A local-network “Who's Who?” style board game built with Node.js, Express, and a modern HTML/CSS/JavaScript front end. Users connect locally to play an interactive game in which they select characters while trying to guess others' mystery character.

## Table of Contents
1. [Project Overview](#project-overview)  
2. [File Structure](#file-structure)  
3. [Getting Started](#getting-started)  
4. [Running Locally](#running-locally)  
5. [Testing](#testing)  
6. [Documentation Generation](#documentation-generation)  
7. [Continuous Integration (GitHub Actions)](#continuous-integration-github-actions)  
8. [New Features and Changes](#new-features-and-changes)

## Project Overview

This application lets multiple players join a “Who’s Who?” game over a local network. The server is built on Express while the front end uses semantic HTML and a dedicated CSS file for its styling. Character information is generated automatically from the images inside of `client/images` (the filename minus extension is used for the character name, and the character IDs are determined by the alphabetical order of the images).

**Key Features**

- **Dynamic Character Setup:** No more static JSON file! Character data is generated from images in the `client/images` folder.
- **Semantic Front End:** HTML is organized using semantic tags (`header`, `main`, `section`, `footer`), while all visual design is centralized in the CSS.
- **Local-Only Server:** By default, the server binds to `127.0.0.1` on port `3000`.  
- **Responsive Design:** The use of a responsive meta viewport and a Google Font (Roboto) gives the application a modern look.
- **REST API:** An Express-based API manages game state and player moves.
- **Testing:** Uses Jest and Supertest with an included test suite.
- **Automated Documentation:** JSDoc extracts documentation from the inline code.
- **GitHub Actions:** A CI pipeline validates code updates, runs tests, and optionally generates documentation.

## Repo Structure

```
whos-who-laptop-game/
├── client/
│   ├── index.html            # Main entry point. Uses semantic tags and minimal markup.
│   ├── css/
│   │   └── style.css         # All styling applied here (including responsive layout, fonts, grid, etc.)
│   └── js/
│       ├── app.js            # Client-side logic: joining the game, handling moves.
│       └── game.js           # Game rendering logic; builds the board and mystery card.
├── server/
│   ├── controllers/
│   │   └── gameController.js # Handles game actions and routes.
│   ├── models/
│   │   ├── Game.js           # Game state – now generates character data from image files.
│   │   └── Player.js         # Player object.
│   ├── routes/
│   │   └── api.js            # Express API routes.
│   ├── utils/
│   │   └── logger.js         # Logging utility.
│   └── index.js              # Application entry point for the Express server.
├── tests/
│   └── sample.test.js        # Example tests using Jest and Supertest.
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions pipeline.
├── jsdoc.config.json         # JSDoc configuration.
├── package.json              # NPM manifest.
└── README.md                 # Project documentation (this file).
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

The server binds to `127.0.0.1` on port `3000` by default.

1. **Start the Server**  
   ```bash
   npm start
   ```
2. **Open the Web App**  
   Open your browser and visit [http://127.0.0.1:3000/](http://127.0.0.1:3000/).  
   You will see the new, semantically structured HTML that displays the mystery (top portion) and the game board (grid of cards).  
   
   *Tip:* If you want your game accessible on your local network, update the listen address in `server/index.js`.

## Testing

Tests use **Jest** and **Supertest**.
- **Run All Tests**  
  ```bash
  npm test
  ```
- A coverage report will also be generated.

## Documentation Generation

JSDoc is used to auto-generate documentation from inline comments:

1. **Add JSDoc Comments:**  
   Your code in the server-side JavaScript files make use of standard JSDoc comments.
2. **Generate Documentation:**  
   ```bash
   npm run doc
   ```
   This creates a `docs/` folder containing HTML documentation. Open `docs/index.html` in your browser.

## Continuous Integration (GitHub Actions)

A sample GitHub Actions workflow is located in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Whenever you push or open a pull request to `main` or `master`, GitHub Actions will:

1. **Install Dependencies**: `npm install`  
2. **Run Tests**: `npm test`  
3. **Generate Documentation**: `npm run doc`  
4. **(Optional) Upload Docs as Artifact** or deploy to GitHub Pages

If you choose to deploy to GitHub Pages, you can adjust the `ci.yml` (see the commented “Deploy to GitHub Pages” step).

_Enjoy playing your local “Who's Who?” game!_