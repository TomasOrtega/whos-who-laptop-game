window.Game = (() => {
  function createCard(character, interactive = false) {
    const card = document.createElement(interactive ? 'button' : 'div');
    card.className = 'card';
    const name = document.createElement('p');
    name.textContent = character.name;
    card.appendChild(name);
    if (character.image) {
      const image = document.createElement('img');
      image.src = character.image;
      image.alt = character.name;
      card.appendChild(image);
    }
    if (interactive) {
      card.type = 'button';
      card.classList.toggle('grayed-out', character.isGrayedOut);
      card.setAttribute('aria-pressed', String(character.isGrayedOut));
    }
    return card;
  }

  function renderGameBoard(playerName, board, onMove) {
    const container = document.getElementById('game-container');
    container.replaceChildren();
    for (const character of board) {
      const card = createCard(character, true);
      card.addEventListener('click', () => onMove(character.id));
      container.appendChild(card);
    }
    if (!board.length) container.textContent = `No characters found for ${playerName}.`;
  }

  function renderMysteryCharacter(mystery) {
    const container = document.getElementById('mystery-container');
    const heading = document.createElement('h2');
    heading.textContent = 'Your mystery character';
    container.replaceChildren(heading);
    if (mystery) container.appendChild(createCard(mystery));
  }

  return { renderGameBoard, renderMysteryCharacter };
})();
