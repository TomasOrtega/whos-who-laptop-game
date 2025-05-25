# Who’s Who? Laptop Game (Tomas & Nora Edition)

A local-network “Who’s Who?” style board game built with Node.js, Express, and a modern HTML/CSS/JavaScript front end. This version is specifically for *two* players, Tomas and Nora. Each player has their *own* board of characters, stored under `client/images/tomas` and `client/images/nora`.

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Gameplay and Mechanics](#gameplay-and-mechanics)  
3. [File Structure](#file-structure)  
4. [Getting Started](#getting-started)  
5. [Running Locally](#running-locally)  
6. [Testing](#testing)  
7. [Documentation Generation](#documentation-generation)



## Project Overview

In this two-player “Who’s Who?” game:

- Nora’s board (images in `client/images/nora`) is visible to Nora, and Nora's “mystery” is randomly chosen from Tomas’s board. The analogous applies for Tomas.
- A “move” is simply toggling a character’s gray-out state on *one's own* board by clicking.  
- The goal is to deduce which character is in the opponent’s board (the “mystery”), but the only mechanic is flipping characters on your own board.  

### How It Works

1. On game creation (via the server API), two boards are loaded: 
   - The “tomas” board (directly from `client/images/tomas`).  
   - The “nora” board (from `client/images/nora`).  
2. The server randomly assigns Tomas’s mystery from Nora’s board, and Nora’s mystery from Tomas’s board.  
3. Each player picks whether they are “Tomas” or “Nora” in their browser. The game then displays that player’s board (with images from the respective folder) and a single “mystery” card (pulled from the *other* board).  
4. Clicking a character *toggles* it as “grayed out” (the server flips its `isGrayedOut` boolean). Clicking again reverts the character to non-grayed.



## Gameplay and Mechanics

1. **Player Identity**  
   When the browser loads, you are prompted: “Are you Tomas or Nora?”  
   If you choose “Tomas,” you see your personal board from `client/images/tomas`. If you choose “Nora,” you see `client/images/nora`.  

2. **Mystery Character**  
   The large card in the “Mystery” area is chosen from the *other* folder. If you’re Tomas, your mystery image is from Nora’s set, and vice versa.  

3. **Move (Toggling)**  
   Clicking a character on your own board sends a request to the server asking to flip that character’s `isGrayedOut`. The server responds, and the UI re-fetches the current board state to show the updated gray or non-gray color.  

4. **Goal**  
   By process of elimination, hopefully you can guess which character from the *other* board is “yours.” This is purely for fun—there is no automated “check guess” in this version.



## Repo Structure

```
whos-who-laptop-game/
├── client/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js           # Starts the game, prompts "Tomas"/"Nora", fetches board & mystery
│       └── game.js          # Renders player's board and toggles gray-out on card clicks
│   └── images/
│       ├── tomas/           # All of Tomas's character images
│       └── nora/            # All of Nora's character images
├── server/
│   ├── controllers/
│   │   └── gameController.js # Contains routes for creating game, fetching state, handling moves
│   ├── models/
│   │   └── Game.js           # Loads the two boards, assigns random mysteries, toggles isGrayedOut
│   ├── routes/
│   │   └── api.js            # Express endpoints for API
│   ├── utils/
│   │   └── logger.js         # Simple logging utility
│   └── index.js              # Main Express server
├── tests/
│   └── sample.test.js        # Sample Jest tests using Supertest
├── package.json
└── README.md                 # This file
```



## Getting Started

1. **Install Dependencies**  
   ```bash
   npm install
   ```
2. **(Optional) Add or remove images**  
   - Put Tomas’s images in `client/images/tomas`.  
   - Put Nora’s images in `client/images/nora`.  
   The filenames (minus extension) become the displayed names on each card.



## Running Locally

1. **Start the Server**  
   ```bash
   npm start
   ```
   The server typically binds on port 3000 (or from `process.env.PORT`).  

2. **Open in Your Browser**  
   e.g. http://localhost:3000/  
   - You’ll be prompted "Are you Tomas or Nora?"  
   - The game then loads your board and your opponent’s mystery.  

Because it’s a two-player game, you can open two browser windows (one as Tomas, one as Nora), or two separate machines on the same network.

## Testing

We use **Jest** and **Supertest**:

- **Run Tests**  
  ```bash
  npm test
  ```
- Some sample tests in `tests/sample.test.js` demonstrate a simple flow.



## Documentation Generation

JSDoc is used for generating API docs:

1. **Add JSDoc Comments** in your server-side code.  
2. **Generate** via:  
   ```bash
   npm run doc
   ```
   This creates a `docs/` folder containing HTML documentation. Open `docs/index.html` in your browser.

_Enjoy playing your local “Who's Who?” game!_