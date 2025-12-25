const board = document.getElementById('board');
const hudX = document.getElementById('hud-x');
const hudO = document.getElementById('hud-o');
const cursorGlow = document.getElementById('cursor-glow');
const modal = document.getElementById('modal');

let currentPlayer = 'X';
let gameActive = true;
let queues = { 'X': [], 'O': [] };

// 1. Mouse Glow Effect
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// 2. Initialize Game
function init() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => makeMove(cell, i));
        board.appendChild(cell);
    }
    updateUI();
}

function makeMove(cell, index) {
    if (!gameActive || cell.innerHTML !== '') return;

    const currentQueue = queues[currentPlayer];

    // Handle Infinite Fade Logic
    if (currentQueue.length === 3) {
        const oldestIdx = currentQueue.shift();
        const oldestCell = document.querySelector(`[data-index="${oldestIdx}"]`);
        oldestCell.innerHTML = '';
        oldestCell.className = 'cell';
    }

    // Add New Move
    currentQueue.push(index);
    const svgId = currentPlayer === 'X' ? '#svg-x' : '#svg-o';
    cell.innerHTML = `<svg><use href="${svgId}"></use></svg>`;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        endGame();
        return;
    }

    // Switch and Update
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateUI();
}
function updateUI() {
    // 1. HUD Active States
    hudX.classList.toggle('active', currentPlayer === 'X');
    hudO.classList.toggle('active', currentPlayer === 'O');

    // 2. NEW: Update Custom Cursor Symbol
    cursorGlow.setAttribute('data-symbol', currentPlayer);

    // 3. Dynamic Board Tilt Logic
    board.classList.toggle('tilt-x', currentPlayer === 'X');
    board.classList.toggle('tilt-o', currentPlayer === 'O');

    // 4. Update Slot Dots
    ['X', 'O'].forEach(p => {
        const dots = document.querySelectorAll(`#slots-${p.toLowerCase()} .slot`);
        dots.forEach((dot, i) => {
            dot.classList.toggle('filled', i < queues[p].length);
        });
    });

    // 5. Handle the "Next to disappear" warning (Static Fade)
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('fading'));
    const nextQueue = queues[currentPlayer];
    if (nextQueue.length === 3) {
        const oldestIdx = nextQueue[0];
        document.querySelector(`[data-index="${oldestIdx}"]`).classList.add('fading');
    }
}

function checkWin() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const cells = document.querySelectorAll('.cell');
    return wins.some(c => c.every(i => cells[i].classList.contains(currentPlayer.toLowerCase())));
}

function endGame() {
    gameActive = false;
    document.getElementById('winner-symbol').innerText = currentPlayer;
    modal.classList.add('active');
}

function resetGame() {
    queues = { 'X': [], 'O': [] };
    currentPlayer = 'X';
    gameActive = true;
    modal.classList.remove('active');
    init();
}

document.getElementById('reset-btn').addEventListener('click', resetGame);
init();