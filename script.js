let board; // The canvas element where the game is drawn
let context; // The 2D drawing context of the canvas
let boardHeight = 640; // Height of the game board
let boardWidth = 360; // Width of the game board
let birdImg; // Image of the bird

// Bird object that contains the bird's properties such as position and size
let bird = {
  positionX: boardWidth / 8, // Initial X position of the bird
  positionY: boardHeight / 2, // Initial Y position of the bird (center of the board)
  birdHeight: 24, // Height of the bird
  birdWidth: 34, // Width of the bird
};

let score = 0; // Initial game score

let pipeVelocity = -1; // Speed at which the pipes move (negative to move left)
let pipes = []; // Array to store pipe objects
let birdYvelocity = 0; // Vertical velocity of the bird (updated with gravity and player input)
let gravity = 0.19; // The force pulling the bird down

let openingSpace = 200; // Initial space between the top and bottom pipes
let openingSpaceReductionRate = 5; // Rate at which the opening space decreases over time

// Game state management
let gameState = 'intro'; // Possible states: 'intro', 'waiting', 'running', 'over'

// Load the bird image
birdImg = new Image();
birdImg.src = "Assets/flappybird.png";

// Load the images for the top and bottom pipes
let TopPipeImg = new Image();
TopPipeImg.src = "Assets/toppipe.png";

let BottomPipeImg = new Image();
BottomPipeImg.src = "Assets/bottompipe.png";

// Define the properties of the top and bottom pipes
let TopPipe = {
  positionX: boardWidth, // Initial X position of the top pipe (offscreen to the right)
  positionY: 0, // Top pipe starts at the top of the canvas
  pipeHeight: 512 - 25, // Height of the top pipe
  pipeWidth: 64, // Width of the top pipe
};

let BottomPipe = {
  positionX: boardWidth, // Initial X position of the bottom pipe (offscreen to the right)
  positionY: 0, // Y position will be calculated dynamically
  pipeHeight: 512 - 25, // Height of the bottom pipe
  pipeWidth: 64, // Width of the bottom pipe
};

// Function to create and draw pipes on the canvas
let drawPipes = function () {
  if (gameState !== 'running') return;

  let randomPipeY =
    TopPipe.positionY - TopPipe.pipeHeight / 4 - Math.random() * (TopPipe.pipeHeight / 2); // Generate a random Y position for the top pipe

  // Gradually reduce the opening space between pipes
  openingSpace = Math.max(openingSpace - openingSpaceReductionRate, 50); // Ensure the opening space doesn't go below 50

  // Create a top pipe object and add it to the pipes array
  let TopPipes = {
    img: TopPipeImg,
    positionX: TopPipe.positionX,
    positionY: randomPipeY,
    height: TopPipe.pipeHeight,
    width: TopPipe.pipeWidth,
    passed: false, // Flag to check if the bird has passed this pipe
  };

  pipes.push(TopPipes);

  // Create a bottom pipe object and add it to the pipes array
  let bottomPipes = {
    img: BottomPipeImg,
    positionX: BottomPipe.positionX,
    positionY: randomPipeY + TopPipe.pipeHeight + openingSpace, // Positioned below the top pipe with an opening space
    width: BottomPipe.pipeWidth,
    height: BottomPipe.pipeHeight,
    passed: false, // Flag to check if the bird has passed this pipe
  };

  pipes.push(bottomPipes);
};

// Function to draw the bird on the canvas
let drawBird = function () {
  context.drawImage(
    birdImg,
    bird.positionX,
    bird.positionY,
    bird.birdWidth,
    bird.birdHeight
  ); // Draw the bird at its current position
};

// Function to detect collisions between the bird and pipes
function detectCollision(bird, pipe) {
  const margin = 7; // Margin of error for easier collisions
  return (
    bird.positionX < pipe.positionX + pipe.width - margin && // Check if bird's left side is before pipe's right side
    bird.positionX + bird.birdWidth - margin > pipe.positionX && // Check if bird's right side is after pipe's left side
    bird.positionY < pipe.positionY + pipe.height - margin && // Check if bird's top side is above pipe's bottom side
    bird.positionY + bird.birdHeight - margin > pipe.positionY // Check if bird's bottom side is below pipe's top side
  );
}

// Function to display the game over screen
function gameOver() {
  context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent overlay
  context.fillRect(0, 0, boardWidth, boardHeight); // Fill the entire screen

  context.font = "48px Arial"; // Set the font for the game over text
  context.fillStyle = "white"; // Set the text color to white
  context.textAlign = "center"; // Center-align the text
  context.fillText("Game Over", boardWidth / 2, boardHeight / 2); // Display the game over message
  context.font = "24px Arial"; // Smaller font for the instructions
  context.fillText(
    "Press Space or Click to Restart",
    boardWidth / 2,
    boardHeight / 2 + 100
  ); // Display restart instructions

  context.font = "24px Arial"; // Set the font for the score
  context.fillText(`Score: ${score}`, boardWidth / 2, boardHeight / 2 + 50); // Display the final score

  gameState = "over"; // Set the game state to 'over'
}

// Function to reset the game and start over
function resetGame() {
  bird.positionY = boardHeight / 2; // Reset bird's position to the center
  birdYvelocity = 0; // Reset bird's vertical velocity
  pipes = []; // Clear the pipes array
  score = 0; // Reset the score
  openingSpace = 200; // Reset the opening space between pipes
  gravity = 0.19;
  pipeVelocity = -1;
  gameState = "waiting"; // Set the game state to 'waiting'

  requestAnimationFrame(update); // Start the game loop again
}

// Function to update the game on every frame
let pipeSpawnTimer = 0;
let pipeSpawnInterval = 3000; // Generate a pipe every 3 seconds

function update() {
  context.clearRect(0, 0, board.width, board.height); // Clear the canvas

  if (gameState === "intro") {
    // Do nothing; the intro overlay handles the display
    requestAnimationFrame(update);
    return;
  }

  if (gameState === "waiting") {
    // Display the waiting message
    context.font = "18px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText(
      "Press Space or Click to Jump",
      boardWidth / 2,
      boardHeight / 2 - 30
    );

    // Draw the bird at its initial position
    drawBird();

    requestAnimationFrame(update);
    return;
  }

  if (gameState === "over") {
    gameOver();
    return;
  }

  // Game is running
  birdYvelocity += gravity; // Apply gravity to the bird's vertical velocity

  if (bird.positionY + bird.birdHeight >= boardHeight) {
    // Check if the bird has hit the ground
    gameOver();
    return;
  }

  bird.positionY = Math.max(bird.positionY + birdYvelocity, 0); // Update bird's position

  drawBird(); // Draw the bird

  // Update pipe spawn timer
  pipeSpawnTimer += 16.66; // Approximate time per frame at 60fps
  if (pipeSpawnTimer >= pipeSpawnInterval) {
    drawPipes();
    pipeSpawnTimer = 0; // Reset timer
  }

  // Update and draw pipes
  pipes.forEach((pipe, index) => {
    context.drawImage(pipe.img, pipe.positionX, pipe.positionY, pipe.width, pipe.height); // Draw each pipe
    pipe.positionX += pipeVelocity; // Move the pipe to the left

    if (detectCollision(bird, pipe)) {
      // Check for collision with the bird
      gameOver();
      return;
    }

    if (pipe.positionX + pipe.width < 0) {
      // Remove pipes that have moved off the screen
      pipes.splice(index, 1);
      score++; // Increment the score when a pipe is passed
    }
  });

  // Display the score
  context.fillStyle = "white"; // Set the score text color
  context.font = "25px Arial"; // Set the font for the score display
  context.fillText(`Score: ${score}`, boardWidth / 10 + 30, boardHeight / 10); // Display the current score

  requestAnimationFrame(update); // Call the update function on the next animation frame
}

// Function to handle bird movement when space is pressed or screen is clicked
function moveBird(e) {
  e.preventDefault();

  if (gameState === "intro") {
    // Do not process events while in intro state
    return;
  }

  if (e.code === "Space" || e.type === "click") {
    if (gameState === "waiting") {
      gameState = "running";
      birdYvelocity = -3; // Start the game with a jump
    } else if (gameState === "running") {
      birdYvelocity = -3; // Make the bird jump
    } else if (gameState === "over") {
      resetGame();
    }
  }
}

// Function to handle touch events on mobile devices
function Touchevent(e) {
  e.preventDefault(); // Prevent default touch behavior

  if (gameState === "intro") {
    // Do not process events while in intro state
    return;
  }

  if (gameState === "waiting") {
    gameState = "running";
    birdYvelocity = -3;
  } else if (gameState === "running") {
    birdYvelocity = -3; // Make the bird jump
  } else if (gameState === "over") {
    resetGame(); // If game over, reset the game
  }
}

// Function that runs when the window is loaded
window.onload = function () {
  board = document.getElementById("board"); // Get the canvas element by its ID
  context = board.getContext("2d"); // Get the 2D drawing context
  board.height = boardHeight; // Set the canvas height
  board.width = boardWidth; // Set the canvas width

  // Center the canvas horizontally
  board.style.display = "block";
  board.style.margin = "0 auto";

  // Display the intro overlay
  document.getElementById("intro-overlay").classList.add("show");

  // Add event listener to the start button
  document.getElementById("start-game").addEventListener("click", function (e) {
    e.stopPropagation(); // Stop the event from bubbling up
    startGame();
  });

  // Prevent clicks on the overlay from triggering game events
  document.getElementById("intro-overlay").addEventListener("click", function (e) {
    e.stopPropagation(); // Stop the event from bubbling up
  });

  requestAnimationFrame(update); // Start the game loop
  document.addEventListener("keydown", moveBird); // Listen for spacebar key presses

  // Only add the click event listener if the device is not a touch device
  if (!('ontouchstart' in window)) {
    document.addEventListener("click", moveBird); // Listen for mouse clicks
  }

  document.addEventListener("touchstart", Touchevent); // Listen for touch events
};


function startGame() {
  document.getElementById("intro-overlay").classList.remove("show");
  gameState = "waiting"; // Set game state to 'waiting'
}
