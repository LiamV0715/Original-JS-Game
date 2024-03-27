const player = document.getElementById('player');
const floor = document.getElementById('floor');

let isJumping = false;
let isCrouching = false;
let isMovingLeft = false;
let isMovingRight = false;
let canDoubleJump = true;
let jumpCount = 0;
let initialHeight = 0; // Define initialHeight outside jump function

const maxSpeed = 1; // Adjust maximum speed as needed

document.addEventListener('keydown', (event) => {
  if (event.key === 'w' || event.key === ' ') { // 'w' key or spacebar for jumping
    if (!isJumping && !isCrouching) {
      isJumping = true;
      jump();
    } else if (canDoubleJump && jumpCount < 2) { // Check for double jump
      jump();
      jumpCount++;
    }
  } else if (event.key === 's') { // 's' key for crouching
    if (!isCrouching) {
      isCrouching = true;
      player.style.height = '100px';
    }
  } else if (event.key === 'a') { // 'a' key for moving left
    isMovingLeft = true;
    moveLeft();
  } else if (event.key === 'd') { // 'd' key for moving right
    isMovingRight = true;
    moveRight();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 's') { // Restore player height when 's' key is released
    isCrouching = false;
    player.style.height = '200px';
  } else if (event.key === 'a') { // Stop moving left when 'a' key is released
    isMovingLeft = false;
  } else if (event.key === 'd') { // Stop moving right when 'd' key is released
    isMovingRight = false;
  }
});

function jump() {
  if (!isJumping) { // Set initialHeight only if not already jumping
    initialHeight = parseInt(player.style.bottom) || 0;
  }
  
  const jumpHeight = 150 - (jumpCount * 50); // Reduce jump height for subsequent jumps
  const jumpDuration = 2000; // Adjust jump duration as needed

  const startTime = Date.now();

  function animateJump() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / jumpDuration, 5);
    const height = initialHeight + jumpHeight * Math.sin(progress * Math.PI);
    player.style.bottom = height + 'px';

    if (progress < 1) {
      requestAnimationFrame(animateJump);
    } else {
      isJumping = false;
      glideDown(initialHeight); // Pass initial height to glideDown()
    }
  }

  animateJump();
}

function glideDown(initialHeight) {
  const floorHeight = '40px' || 0;
  let currentHeight = parseInt(player.style.bottom) || 0;

  function animateGlide() {
    currentHeight -= 2; // Adjust glide speed as needed
    player.style.bottom = Math.max(currentHeight, initialHeight) + 'px';

    if (currentHeight > initialHeight) {
      requestAnimationFrame(animateGlide);
    }
  }

  animateGlide();
}

function moveLeft() {
  if (!isMovingLeft) return;
  const currentPosition = parseInt(player.style.left) || 0;
  const newPosition = Math.max(currentPosition - maxSpeed, 0); // Adjust maximum speed
  player.style.left = newPosition + 'px';
  requestAnimationFrame(moveLeft);
}

function moveRight() {
  if (!isMovingRight) return;
  const gameContainerWidth = document.getElementById('game-container').offsetWidth;
  const playerWidth = player.offsetWidth;
  const currentPosition = parseInt(player.style.left) || 50;
  const newPosition = Math.min(currentPosition + maxSpeed, gameContainerWidth - playerWidth); // Adjust maximum speed
  player.style.left = newPosition + 'px';
  requestAnimationFrame(moveRight);
}

function checkCollisions() {
  const playerRect = player.getBoundingClientRect();
  const floorRect = floor.getBoundingClientRect();

  if (playerRect.bottom >= floorRect.top) { // Check if player is on the floor
    player.style.bottom = (floorRect.height + 20) + 'px'; // 20px is the height of the floor
    jumpCount = 0; // Reset jump count when player touches the ground
  }
}

setInterval(checkCollisions, 10); // Check collisions periodically

