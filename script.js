const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('.start'),
    win: document.querySelector('.win'),
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
};

const shuffle = array => {
    const clonedArray = [...array];
    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const original = clonedArray[i];
        clonedArray[i] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }
    return clonedArray;
};

const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];
    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }
    return randomPicks;
};

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimensions');
    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }

    // New set of cartoon-like emojis
    const cartoonEmojis = [
        '👾', // Alien Monster
        '🤖', // Robot Face
        '🦄', // Unicorn
        '🐵', // Monkey Face
        '🐸', // Frog Face
        '🐻', // Bear Face
        '🐯', // Tiger Face
        '🐱', // Cat Face
        '🐶', // Dog Face
        '🐼', // Panda Face
        '🐷', // Pig Face
        '🐹', // Hamster Face
        '👹', // Ogre
        '👺', // Goblin
        '💀', // Skull
        '🎃', // Jack-o-lantern
        '👽', // Alien
        '🦊', // Fox Face
    ];

    const picks = pickRandom(cartoonEmojis, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);

    selectors.board.innerHTML = ''; // Clear the board
    selectors.board.style.gridTemplateColumns = `repeat(${Math.sqrt(dimensions)}, 1fr)`; // Dynamic grid

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
            </div>
        `;
        selectors.board.appendChild(card);
    });
};

const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');

    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.moves.innerHTML = `${state.totalFlips} moves`;
        selectors.timer.innerHTML = `Time: ${state.totalTime} sec`;
    }, 1000);
};

const flipCard = card => {
    if (
        state.flippedCards < 2 &&
        !card.classList.contains('flipped') &&
        !card.classList.contains('matched')
    ) {
        card.classList.add('flipped');
        state.flippedCards++;
        state.totalFlips++;

        if (!state.gameStarted) {
            startGame();
        }

        if (state.flippedCards === 2) {
            const flippedCards = document.querySelectorAll('.flipped:not(.matched)');
            if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
                flippedCards[0].classList.add('matched');
                flippedCards[1].classList.add('matched');
            }

            setTimeout(() => {
                flipBackCards();
            }, 1000);
        }
    }
};

const flipBackCards = () => {
    state.flippedCards = 0;

    document.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('matched') && card.classList.contains('flipped')) {
            card.classList.remove('flipped');
        }
    });

    if (document.querySelectorAll('.card.matched').length === selectors.board.children.length) {
        setTimeout(() => {
            selectors.win.style.display = 'block';
            selectors.win.innerHTML = `
                <span>You won!<br />With ${state.totalFlips} moves<br />Under ${state.totalTime} seconds</span>
            `;
            clearInterval(state.loop);
        }, 1000);
    }
};

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.closest('.card');

        if (eventParent && !eventParent.classList.contains('flipped') && !eventParent.classList.contains('matched')) {
            flipCard(eventParent);
        } else if (eventTarget === selectors.start && !eventTarget.classList.contains('disabled')) {
            startGame();
        }
    });
};

generateGame();
attachEventListeners();
