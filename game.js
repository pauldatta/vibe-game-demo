const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let isGameOver = false;

// Player
const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

const playerImage = new Image();
playerImage.src = 'assets/images/merlion.png';

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    player.velocity += player.gravity;
    player.y += player.velocity;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocity = 0;
        gameOver();
    }

    if (player.y < 0) {
        player.y = 0;
        player.velocity = 0;
        gameOver();
    }
}

function playerJump() {
    if (!isGameOver) {
        player.velocity = player.lift;
    }
}

// Obstacles
let obstacles = [];
const obstacleWidth = 80;
const obstacleGap = 200;
const obstacleSpeed = 5;
let frameCount = 0;

const obstacleImage = new Image();
obstacleImage.src = 'assets/images/obstacle.png';

function createObstacle() {
    const obstacleY = Math.random() * (canvas.height - obstacleGap - 200) + 100;
    obstacles.push({
        x: canvas.width,
        y: obstacleY + obstacleGap,
        width: obstacleWidth,
        height: canvas.height - obstacleY - obstacleGap,
        isTop: false,
        passed: false
    });
    obstacles.push({
        x: canvas.width,
        y: 0,
        width: obstacleWidth,
        height: obstacleY,
        isTop: true,
        passed: false
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    if (frameCount % 90 === 0) {
        createObstacle();
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;

        if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
            if (!obstacle.isTop) {
                score++;
            }
            obstacle.passed = true;
        }
    });

    // Remove off-screen obstacles
    if (obstacles.length > 0 && obstacles[0].x + obstacleWidth < 0) {
        obstacles.splice(0, 2);
    }
}

function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver();
        }
    });
}

// Score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}


// Game Over
function gameOver() {
    isGameOver = true;
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2 - 50);
    ctx.font = '20px Arial';
    ctx.fillText('Click or press Space to restart', canvas.width / 2 - 150, canvas.height / 2);
}

function restartGame() {
    isGameOver = false;
    score = 0;
    player.y = canvas.height / 2;
    player.velocity = 0;
    obstacles = [];
    frameCount = 0;
    gameLoop();
}


// Event Listeners
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (isGameOver) {
            restartGame();
        } else {
            playerJump();
        }
    }
});

document.addEventListener('click', function() {
    if (isGameOver) {
        restartGame();
    } else {
        playerJump();
    }
});


function gameLoop() {
    if (isGameOver) {
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Player
    drawPlayer();
    updatePlayer();

    // Obstacles
    drawObstacles();
    updateObstacles();

    // Collisions
    checkCollisions();

    // Score
    drawScore();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();