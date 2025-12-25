const board = document.getElementById('board');
const hudX = document.getElementById('hud-x');
const hudO = document.getElementById('hud-o');
const cursorGlow = document.getElementById('cursor-glow');
const modal = document.getElementById('modal');
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let currentPlayer = 'X';
let gameActive = true;
let roundCount = 1;
let scores = { 'X': 0, 'O': 0 };
let queues = { 'X': [], 'O': [] };
let particles = [];

// Handle canvas for victory particles
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.onresize = resize;
resize();

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

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

    if (currentQueue.length === 3) {
        const oldestIdx = currentQueue.shift();
        const oldestCell = document.querySelector(`[data-index="${oldestIdx}"]`);
        oldestCell.innerHTML = '';
        oldestCell.className = 'cell';
    }

    currentQueue.push(index);
    const svgId = currentPlayer === 'X' ? '#svg-x' : '#svg-o';
    cell.innerHTML = `<svg><use href="${svgId}"></use></svg>`;
    cell.classList.add(currentPlayer.toLowerCase());

    const winCombo = checkWin();
    if (winCombo) {
        triggerVictory(winCombo);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateUI();
}

function updateUI() {
    hudX.classList.toggle('active', currentPlayer === 'X');
    hudO.classList.toggle('active', currentPlayer === 'O');
    cursorGlow.setAttribute('data-symbol', currentPlayer);
    board.classList.toggle('tilt-x', currentPlayer === 'X');
    board.classList.toggle('tilt-o', currentPlayer === 'O');

    ['X', 'O'].forEach(p => {
        const dots = document.querySelectorAll(`#slots-${p.toLowerCase()} .slot`);
        dots.forEach((dot, i) => dot.classList.toggle('filled', i < queues[p].length));
    });

    document.querySelectorAll('.cell').forEach(c => c.classList.remove('fading'));
    const nextQueue = queues[currentPlayer];
    if (nextQueue.length === 3) {
        const target = document.querySelector(`[data-index="${nextQueue[0]}"]`);
        if (target) target.classList.add('fading');
    }
}

function checkWin() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const cells = document.querySelectorAll('.cell');
    return wins.find(c => c.every(i => cells[i].classList.contains(currentPlayer.toLowerCase()))) || null;
}

// Particle Logic
class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 12;
        this.speedY = (Math.random() - 0.5) * 12;
        this.opacity = 1;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        this.opacity -= 0.01;
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    if (particles.length > 0) requestAnimationFrame(animateParticles);
}

function triggerVictory(combo) {
    gameActive = false;
    scores[currentPlayer]++;
    
    // Burst particles
    const color = currentPlayer === 'X' ? '#00f2ff' : '#7000ff';
    for(let i=0; i<100; i++) particles.push(new Particle(window.innerWidth/2, window.innerHeight/2, color));
    animateParticles();

    document.body.classList.add('victory-shake');
    combo.forEach(idx => document.querySelector(`[data-index="${idx}"]`).classList.add('winning-cell'));

    setTimeout(() => {
        document.body.classList.remove('victory-shake');
        endGame();
    }, 600);
}

function endGame() {
    document.getElementById('winner-symbol').innerText = currentPlayer;
    document.getElementById('score-x').innerText = scores['X'].toString().padStart(2, '0');
    document.getElementById('score-o').innerText = scores['O'].toString().padStart(2, '0');
    modal.classList.add('active');

    const handleReset = () => {
        modal.removeEventListener('click', handleReset);
        resetGame();
    };
    modal.addEventListener('click', handleReset);
}

function resetGame(nextRound = true) {
    if (nextRound) roundCount++;
    document.getElementById('round-display').innerText = `ROUND ${roundCount.toString().padStart(2, '0')}`;
    queues = { 'X': [], 'O': [] };
    currentPlayer = 'X';
    gameActive = true;
    modal.classList.remove('active');
    init();
}

document.getElementById('reset-btn').onclick = () => resetGame(false);
init();