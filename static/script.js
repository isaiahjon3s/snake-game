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

document.addEventListener('keydown', changeDirection);
document.addEventListener('DOMContentLoaded', () => {
    startGame();
    loadHighScores();
    spawnFood();
});

function startGame() { 
    if (gameLoop) clearInterval(gameLoop); // Function checks if the gameLoop has a value, and if it does, clears the interval
    speed = 100 - (level - 1) * 10; // Level 1: 100ms, Level 2: 70ms, Level 3: 40ms
    gameLoop = setInterval(update, speed);
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
            endGame('You won! Completed all levels.');
        }
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame('Game Over! Wall collision.');
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame('Game Over! Self collision.');
            return;
        }
    }

    draw();
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}


function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
        case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
        case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
        case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
    }
}

function levelUp() {
    level++;
    document.getElementById('level').textContent = level;
    startGame();
}

function endGame(message) {
    clearInterval(gameLoop);
    const name = prompt(`${message} Enter your name:`);
    if (name) saveScore(name, score);
    resetGame();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    level = 1;
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    startGame();
    loadHighScores();
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

function loadHighScores() {
    fetch('/high_scores')
        .then(response => response.json())
        .then(scores => {
            const scoresList = document.getElementById('scores-list');
            scoresList.innerHTML = '';
            scores.forEach(s => {
                const li = document.createElement('li');
                li.textContent = `${s.name}: ${s.score}`;
                scoresList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading scores:', error));
}