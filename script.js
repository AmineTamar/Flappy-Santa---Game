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

let pipeVelocity = -2;
let pipes = [];
let birdYvelocity = 0;
let gravity = 0.4;
let gameRunning = true;
let gameOverMessageShown = false;

birdImg = new Image();
birdImg.src = "/Assets/flappybird.png";

let TopPipeImg = new Image();
TopPipeImg.src = "/Assets/toppipe.png";

let BottomPipeImg = new Image();
BottomPipeImg.src = "/Assets/bottompipe.png";

let TopPipe = {
  positionX: boardWidth,
  positionY: 0,
  pipeHeight: 512,
  pipeWidth: 64,
};

let BottomPipe = {
  positionX: boardWidth,
  positionY: 0,
  pipeHeight: 512,
  pipeWidth: 64,
};

let drawPipes = function () {
  let randomPipeY =
    TopPipe.positionY -
    TopPipe.pipeHeight / 4 -
    Math.random() * (TopPipe.pipeHeight / 2);

  let openingSpace = TopPipe.pipeHeight / 4;

  let TopPipes = {
    img: TopPipeImg,
    positionX: TopPipe.positionX,
    positionY: randomPipeY,
    height: TopPipe.pipeHeight,
    width: TopPipe.pipeWidth,
    passed: false,
  };

  pipes.push(TopPipes);

  let bottomPipes = {
    img: BottomPipeImg,
    positionX: BottomPipe.positionX,
    positionY: randomPipeY + TopPipe.pipeHeight + openingSpace,
    width: BottomPipe.pipeWidth,
    height: BottomPipe.pipeHeight,
    passed: false,
  };

  pipes.push(bottomPipes);
};

let drawBird = function () {
  context.drawImage(
    birdImg,
    bird.positionX,
    bird.positionY,
    bird.birdWidth,
    bird.birdHeight
  );
};

function detectCollision(bird, pipe) {
  return (
    bird.positionX < pipe.positionX + pipe.width &&
    bird.positionX + bird.birdWidth > pipe.positionX &&
    bird.positionY < pipe.positionY + pipe.height &&
    bird.positionY + bird.birdHeight > pipe.positionY
  );
}

function gameOver() {

  context.fillStyle = "red";
  context.font = "40px Arial";
  context.fillText("Game Over", boardWidth / 5, boardHeight / 2);
  context.font = "20px Arial";
  context.fillText("Press Space to Play Again", boardWidth / 6, boardHeight / 2 + 40);

  gameRunning = false;
  gameOverMessageShown = true;
}

function resetGame() {
  bird.positionY = boardHeight / 2;
  birdYvelocity = 0;
  pipes = [];
  gameRunning = true;
  gameOverMessageShown = false;
  requestAnimationFrame(update);
}

function update() {
  if (!gameRunning) return;

  context.clearRect(0, 0, board.width, board.height);

  birdYvelocity += gravity;

  if (bird.positionY + bird.birdHeight >= boardHeight) {
    gameOver();
    return;
  }

  bird.positionY = Math.max(bird.positionY + birdYvelocity, 0);

  drawBird();

  pipes.forEach((pipe, index) => {
    context.drawImage(
      pipe.img,
      pipe.positionX,
      pipe.positionY,
      pipe.width,
      pipe.height
    );
    pipe.positionX = pipe.positionX + pipeVelocity;

    if (detectCollision(bird, pipe)) {
      gameOver();
      return;
    }

    if (pipe.positionX + pipe.width < 0) {
      pipes.splice(index, 1);
    }
  });

  requestAnimationFrame(update);
}

function moveBird(e) {
  if (e.code === "Space") {
    if (gameOverMessageShown) {
      resetGame(); // Restart the game if it's over
    } else {
      birdYvelocity = -5;
    }
  }
}

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d");
  board.height = boardHeight;
  board.width = boardWidth;

  setInterval(drawPipes, 1500);
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveBird);
};
