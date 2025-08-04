// --- SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(0, 800, 600, 0, 1, 1000);
camera.position.z = 500;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas') });
renderer.setSize(800, 600);

// --- DOM ELEMENTS ---
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// --- GAME VARIABLES ---
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let merlion, background, obstacleGroup;
let velocity = 0;
const gravity = -0.5;
const flapStrength = 10;
const obstacleSpeed = -4;
const obstacleGap = 200;
const spawnInterval = 1500; // ms
let lastSpawn = 0;


// --- LOAD ASSETS ---
const textureLoader = new THREE.TextureLoader();

function init() {
    // Background
    const backgroundTexture = textureLoader.load('assets/images/background.png');
    const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
    const backgroundGeometry = new THREE.PlaneGeometry(800, 600);
    background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    background.position.set(400, 300, 0); // Center it
    scene.add(background);

    // Merlion
    const merlionTexture = textureLoader.load('assets/images/merlion.png');
    const merlionMaterial = new THREE.MeshBasicMaterial({ map: merlionTexture, transparent: true });
    const merlionGeometry = new THREE.PlaneGeometry(80, 80); // Adjust size as needed
    merlion = new THREE.Mesh(merlionGeometry, merlionMaterial);
    merlion.position.set(150, 300, 1);
    scene.add(merlion);

    // Obstacles
    obstacleGroup = new THREE.Group();
    scene.add(obstacleGroup);

    // Set initial state
    resetGame();
    animate();
}

// --- GAME LOGIC ---
function resetGame() {
    score = 0;
    velocity = 0;
    merlion.position.y = 300;
    scoreElement.innerText = `Score: ${score}`;
    startScreen.classList.add('active');
    gameOverScreen.classList.remove('active');
    gameState = 'start';

    // Clear existing obstacles
    while (obstacleGroup.children.length > 0) {
        obstacleGroup.remove(obstacleGroup.children[0]);
    }
    lastSpawn = 0;
}

function startGame() {
    gameState = 'playing';
    startScreen.classList.remove('active');
}

function endGame() {
    gameState = 'gameover';
    finalScoreElement.innerText = score;
    gameOverScreen.classList.add('active');
}

function flap() {
    velocity = flapStrength;
}

function spawnObstacle() {
    const obstacleHeight = 600; // Assuming the obstacle image is tall
    const obstacleWidth = 100;
    const gapCenter = Math.random() * (400 - 100) + 150; // Randomize gap position

    const obstacleTexture = textureLoader.load('assets/images/obstacle.png');
    const obstacleMaterial = new THREE.MeshBasicMaterial({ map: obstacleTexture, transparent: true });

    // Top Obstacle
    const topGeometry = new THREE.PlaneGeometry(obstacleWidth, obstacleHeight);
    const topObstacle = new THREE.Mesh(topGeometry, obstacleMaterial);
    topObstacle.position.set(900, gapCenter + obstacleGap / 2 + obstacleHeight / 2, 1);
    topObstacle.userData = { type: 'obstacle' };
    obstacleGroup.add(topObstacle);

    // Bottom Obstacle
    const bottomGeometry = new THREE.PlaneGeometry(obstacleWidth, obstacleHeight);
    const bottomObstacle = new THREE.Mesh(bottomGeometry, obstacleMaterial);
    bottomObstacle.position.set(900, gapCenter - obstacleGap / 2 - obstacleHeight / 2, 1);
    bottomObstacle.userData = { type: 'obstacle' };
    obstacleGroup.add(bottomObstacle);
    
    // Score Zone
    const scoreZoneGeometry = new THREE.PlaneGeometry(10, obstacleGap);
    const scoreZoneMaterial = new THREE.MeshBasicMaterial({visible: false});
    const scoreZone = new THREE.Mesh(scoreZoneGeometry, scoreZoneMaterial);
    scoreZone.position.set(900 + obstacleWidth/2, gapCenter, 1);
    scoreZone.userData = {type: 'scoreZone', passed: false};
    obstacleGroup.add(scoreZone);
}

function updateObstacles() {
    if (Date.now() - lastSpawn > spawnInterval) {
        spawnObstacle();
        lastSpawn = Date.now();
    }

    const merlionBox = new THREE.Box3().setFromObject(merlion);

    for (let i = obstacleGroup.children.length - 1; i >= 0; i--) {
        const obstacle = obstacleGroup.children[i];
        obstacle.position.x += obstacleSpeed;

        // Collision detection
        const obstacleBox = new THREE.Box3().setFromObject(obstacle);
        if (obstacle.userData.type === 'obstacle' && merlionBox.intersectsBox(obstacleBox)) {
            endGame();
        }
        
        // Score detection
        if (obstacle.userData.type === 'scoreZone' && !obstacle.userData.passed && merlionBox.intersectsBox(obstacleBox)) {
            score++;
            scoreElement.innerText = `Score: ${score}`;
            obstacle.userData.passed = true;
        }


        // Remove off-screen obstacles
        if (obstacle.position.x < -100) {
            obstacleGroup.remove(obstacle);
        }
    }
}


function update() {
    if (gameState === 'playing') {
        // Apply gravity
        velocity += gravity;
        merlion.position.y += velocity;

        // Check boundaries
        if (merlion.position.y > 600 - 40) { // Top boundary
            merlion.position.y = 600 - 40;
            velocity = 0;
        }

        if (merlion.position.y < 40) { // Bottom boundary
            merlion.position.y = 40;
            velocity = 0;
            endGame();
        }

        updateObstacles();
    }
}


// --- RENDER LOOP ---
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// --- EVENT LISTENERS ---
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (gameState === 'start') {
            startGame();
            flap();
        } else if (gameState === 'playing') {
            flap();
        }
    }
});

restartButton.addEventListener('click', () => {
    resetGame();
    // We need to re-add the start screen active class
    // because the resetGame function is also called at the beginning
    startScreen.classList.add('active');
    gameOverScreen.classList.remove('active');
});


// --- INITIALIZE ---
init();
