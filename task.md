# Flappy Merlion Task List

*Last Updated: Monday, 4 August 2025*

## Phase 1: Project Setup & Asset Generation

- [x] Create `index.html`
- [x] Create `style.css`
- [x] Create `game.js`
- [x] Create `assets/images` directory
- [x] Generate Merlion sprite (`merlion.png`)
- [x] Generate Obstacle sprite (`obstacle.png`)
- [x] Generate Background image (`background.png`)

## Phase 2: Basic Scene with Three.js

- [x] Include Three.js library in `index.html`
- [x] Create a canvas in `index.html`
- [x] Initialize Scene, Camera, and Renderer in `game.js`
- [x] Add the background image to the scene
- [x] Add the Merlion sprite to the scene

## Phase 3: Player Mechanics

- [x] Add event listener for `keydown` (Spacebar)
- [x] Implement gravity constant
- [x] Implement upward "flap" force
- [x] Add boundaries to keep the player on screen

## Phase 4: Obstacles and Gameplay Loop

- [x] Create a function to spawn a pair of obstacles
- [x] Randomize the vertical position of the obstacle gap
- [x] Move obstacles from right to left
- [x] Despawn obstacles when they move off-screen
- [x] Continuously spawn new obstacles

## Phase 5: Scoring and Collision Detection

- [x] Implement bounding box collision detection for Merlion and obstacles
- [x] Implement collision with top/bottom boundaries
- [x] Create a score variable
- [x] Increment score when an obstacle is passed
- [x] Display score on the UI

## Phase 6: Game State and UI

- [x] Create a `gameState` variable (`start`, `playing`, `gameover`)
- [x] Implement the `start` screen logic
- [x] Implement the `gameover` logic
- [x] Display a "Game Over" message
- [x] Create and implement a "Restart" button
- [x] Reset game state on restart

## Phase 7: Refinement & Polish

- [ ] Add a simple "flap" animation to the Merlion
- [ ] Tweak game difficulty (speed, gravity, gap size)
- [ ] Ensure cross-browser compatibility
- [ ] Add comments to the code
