const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = {}
let dx = 0;
let dy = 0;
let score = 0;
let level = 1;
let speed = 100;
let gameLoop;
let startTime;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas
    initializeCanvas();
    
    // Get DOM elements once
    const usernameOverlay = document.getElementById('username-overlay');
    const usernameForm = document.getElementById('username-form');
    const usernameInput = document.getElementById('username-input');

    // Show overlay and focus input
    usernameOverlay.style.display = 'flex';
    usernameInput.focus();
    
    // Handle form submission (works for both button click and Enter key)
    usernameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        
        if (username) {

            localStorage.setItem('username', username);
            usernameOverlay.style.display = 'none';
            startGame();
            draw();


        }
    });
});

function initializeCanvas() {
    // Clear canvas and set initial state
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    spawnFood();
    draw();
}

function startNewGame() {
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    score = 0;
    level = 1;
    dx = 0;
    dy = 0;
    speed = 100;
    
    // Reset UI
    document.getElementById('score').textContent = '0';
    document.getElementById('level').textContent = '1';
    
    // Hide overlays
    document.getElementById('gameOverOverlay').style.display = 'none';
    
    if(gameLoop) clearInterval(gameLoop); // Clear any existing game loop

    // Draw initial state without starting movement
    spawnFood();
    draw();

    // Add keyboard listener for arrow keys
    document.addEventListener('keydown', changeDirection);
}

function startGame() { 
    if (gameLoop) clearInterval(gameLoop); 
    startTime = Date.now(); // Record the start time
    speed = 100 - (level - 1) * 10; 
    gameLoop = setInterval(update, speed);
}

function endGame() {
    clearInterval(gameLoop);
    const timeAlive = Math.floor((Date.now() - startTime) / 1000);
    const username = localStorage.getItem('username');
    
    // Save score to localStorage
    const scores = JSON.parse(localStorage.getItem('highScores') || '[]');
    scores.push({ username, score, timeAlive });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(scores.slice(0, 10)));
    
    showGameOverPopup(timeAlive);
}

function showGameOverPopup(timeAlive) {
    const overlay = document.getElementById('gameOverOverlay');
    const stats = document.getElementById('gameStats');
    
    // Make sure we have these elements
    if (!overlay || !stats) {
        console.error('Game over elements not found');
        return;
    }

    stats.innerHTML = `
        <p>Final Score: ${score}</p>
        <p>Highest Level: ${level}</p>
        <p>Time Survived: ${timeAlive} seconds</p>
    `;
    overlay.style.display = 'block';
}

function hideGameOverPopup() {
    const overlay = document.getElementById('gameOverOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        resetGame();
    }
}

function recordTime(timeAlive) {
    fetch('/record_time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time_alive: timeAlive })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) console.log(data.message);
    })
    .catch(error => console.error('Error recording time:', error));
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        spawnFood();
        if (score >= level * 10 && level < 9) {
            levelUp();
        } else if (level === 9 && score >= 90) {
            return;
        }
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * gridSize, 
            segment.y * gridSize, 
            gridSize - 2, 
            gridSize - 2
        );
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );
}

function spawnFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

}

function changeDirection(event) {
    event.preventDefault(); // Prevent page scrolling
    
    switch (event.key) {
        case 'ArrowLeft': 
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowUp': 
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowRight': 
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
        case 'ArrowDown': 
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
    }
}

function levelUp() {
    level++;
    document.getElementById('level').textContent = level;
    startGame();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    level = 1;
    document.getElementById('score').textContent = '0';
    document.getElementById('level').textContent = '1';
    startGame();
}

function saveScore(name, score) {
    fetch('/save_score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) console.log(data.message);
        loadHighScores();
    })
    .catch(error => console.error('Error saving score:', error));
}

