let board;
let context;
let boardHeight = 640;
let boardWidth = 360;
let birdImg;

let bird = {
  positionX: boardWidth / 8,
  positionY: boardHeight / 2,
  birdHeight: 24,
  birdWidth: 34,
};

let pipes = [];
let birdYvelocity = 0;
let gravity = 0; // Gravity disabled for testing
let gameRunning = true;
let gameOverMessageShown = false;

let openingSpace = 200; // Initial opening space between pipes

birdImg = new Image();
birdImg.src = "Assets/flappybird.png";

let TopPipeImg = new Image();
TopPipeImg.src = "Assets/toppipe.png";

let BottomPipeImg = new Image();
BottomPipeImg.src = "Assets/bottompipe.png";

// Fixed pipe position for testing
let TopPipe = {
  positionX: boardWidth / 2,  // Fixed position at the center of the canvas
  positionY: 100,
  pipeHeight: 300,
  pipeWidth: 64,
};

// Add pipe to pipes array for testing collision
pipes.push(TopPipe);

// Function to detect collision with a margin of 4 pixels
function detectCollision(bird, pipe) {
  const margin = 7; // Margin of error for easier collisions

  return (
    bird.positionX < pipe.positionX + pipe.pipeWidth - margin && // Bird's left side compared to pipe's right side
    bird.positionX + bird.birdWidth - margin > pipe.positionX && // Bird's right side compared to pipe's left side
    bird.positionY < pipe.positionY + pipe.pipeHeight -margin  && // Bird's top side compared to pipe's bottom side
    bird.positionY + bird.birdHeight - margin > pipe.positionY // Bird's bottom side compared to pipe's top side
  );
}

// Function to draw the bird
let drawBird = function () {
  context.drawImage(
    birdImg,
    bird.positionX,
    bird.positionY,
    bird.birdWidth,
    bird.birdHeight
  );
  
  // Draw outline for bird for easier testing
  context.strokeStyle = "red";
  context.strokeRect(bird.positionX, bird.positionY, bird.birdWidth, bird.birdHeight);
};

// Function to draw pipes
let drawPipes = function () {
  context.drawImage(
    TopPipeImg,
    TopPipe.positionX,
    TopPipe.positionY,
    TopPipe.pipeWidth,
    TopPipe.pipeHeight
  );

  // Draw outline for pipe for easier testing
  context.strokeStyle = "green";
  context.strokeRect(TopPipe.positionX, TopPipe.positionY, TopPipe.pipeWidth, TopPipe.pipeHeight);
};

// Function to handle manual bird movement (for testing)
function moveBird(e) {
  switch(e.code) {
    case "ArrowUp":
      bird.positionY -= 5; // Move bird up
      break;
    case "ArrowDown":
      bird.positionY += 5; // Move bird down
      break;
    case "ArrowLeft":
      bird.positionX -= 5; // Move bird left
      break;
    case "ArrowRight":
      bird.positionX += 5; // Move bird right
      break;
  }

  // Check collision and log the result
  if (detectCollision(bird, TopPipe)) {
    console.log("Collision detected!");
  } else {
    console.log("No collision.");
  }
}

// Main game update function (simplified for testing)
function update() {
  context.clearRect(0, 0, board.width, board.height); // Clear the canvas

  drawBird(); // Draw the bird
  drawPipes(); // Draw the pipes

  requestAnimationFrame(update); // Continuously call update
}

// Setup the canvas and event listeners
window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d");
  board.height = boardHeight;
  board.width = boardWidth;

  requestAnimationFrame(update); // Start the update loop

  // Add event listener for manual bird movement using arrow keys
  document.addEventListener("keydown", moveBird);
};
