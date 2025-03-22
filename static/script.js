const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let level = 1;
let speed = 100; // Milliseconds between updates
let gameLoop;

// Game initialization
document.addEventListener('keydown', changeDirection);
startGame();

function startGame() {
    if (gameLoop) clearInterval(gameLoop);
    speed = 100 - (level - 1) * 30; // Faster each level
    gameLoop = setInterval(update, speed);
}

function update() {
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        spawnFood();
        if (score >= level * 30) { // Level up every 30 points
            levelUp();
        }
    } else {
        snake.pop();
    }

    // Check wall collision (game over)
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
        return;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }

    // Draw everything
    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function changeDirection(event) {
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    switch (event.keyCode) {
        case LEFT: if (dx !== 1) { dx = -1; dy = 0; } break;
        case UP: if (dy !== 1) { dx = 0; dy = -1; } break;
        case RIGHT: if (dx !== -1) { dx = 1; dy = 0; } break;
        case DOWN: if (dy !== -1) { dx = 0; dy = 1; } break;
    }
}

function levelUp() {
    if (level < 3) {
        level++;
        document.getElementById('level').textContent = level;
        startGame(); // Restart with new speed
    } else {
        alert('You won! Game completed.');
        resetGame();
    }
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
}