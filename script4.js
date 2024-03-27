function newImage(url){
    let image = document.createElement('img')
    image.src = url
    image.style.position = 'absolute'
    document.body.append(image)
    return image
}

const player = newImage('assets/brain-right.png');
const floor = document.getElementById('floor');

let isJumping = false;
let isCrouching = false;
let isMovingLeft = false;
let isMovingRight = false;
let canDoubleJump = true; // try to make this one happen

const maxSpeed = 1; // Adjust maximum speed as needed
//defining character to change when moving


document.addEventListener('keydown', (event) => {
  if (event.key === 'w' || event.key === ' ') { // 'w' key or spacebar for jumping
    if (!isJumping && !isCrouching) {
      isJumping = true;
      jump();
    }
  } else if (event.key === 's') { // 's' key for crouching
    if (!isCrouching) {
      isCrouching = true;
      player.src = 'assets/crouch-brain-right.png';
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
    player.src = 'assets/brain-right.png';
    player.style.height = '200px';
  } else if (event.key === 'a') { // Stop moving left when 'a' key is released
    isMovingLeft = false;
    player.src = 'assets/brain-left.png';
  } else if (event.key === 'd') { // Stop moving right when 'd' key is released
    isMovingRight = false;
    player.src = 'assets/brain-right.png';
  }
});

function jump() {
  let initialHeight = parseInt(player.style.bottom) || 0;
  const jumpHeight = 150; // Adjust jump height as needed
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
      glideDown();
    }
  }

  animateJump();
}

function glideDown() {
  const floorHeight = '40px' || 0;
  let currentHeight = parseInt(player.style.bottom) || 0;

  function animateGlide() {
    currentHeight -= 2; // Adjust glide speed as needed
    player.style.bottom = Math.min(currentHeight, floorHeight) + 'px';

    if (currentHeight > 0) {
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
  player.src = '/assets/fast-brain-left.png';
  requestAnimationFrame(moveLeft);
}

function moveRight() {
  if (!isMovingRight) return;
  const gameContainerWidth = document.getElementById('game-container').offsetWidth;
  const playerWidth = player.offsetWidth;
  const currentPosition = parseInt(player.style.left) || 0;
  const newPosition = Math.min(currentPosition + maxSpeed, gameContainerWidth - playerWidth); // Adjust maximum speed
  player.style.left = newPosition + 'px';
  player.src = '/assets/fast-brain-right.png';
  requestAnimationFrame(moveRight);
}

function checkCollisions() {
  const playerRect = player.getBoundingClientRect();
  const floorRect = floor.getBoundingClientRect();

  if (playerRect.bottom >= floorRect.top) { // Check if player is on the floor
    player.style.bottom = (floorRect.height + 0) + 'px'; // 20px is the height of the floor
  }
}

setInterval(checkCollisions, 10); // Check collisions periodically
