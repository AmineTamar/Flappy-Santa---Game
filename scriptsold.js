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



birdImg = new Image();
birdImg.src = "/Assets/flappybird.png";

TopPipeImg = new Image();
TopPipeImg.src = "/Assets/toppipe.png";

BottomPipeImg = new Image();
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

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d");
  board.height = boardHeight;
  board.width = boardWidth;

  setInterval(drawPipes, 1500);

  requestAnimationFrame(update);

  document.addEventListener("keydown", moveBird);
};

function update() {
  context.clearRect(0, 0, board.width, board.height);

  birdYvelocity += gravity;


  bird.positionY = Math.max(bird.positionY + birdYvelocity, 0) //makes sure doesnt pass the top of the canvas


  drawBird();

  pipes.forEach((pipe) => {
    context.drawImage(
      pipe.img,
      pipe.positionX,
      pipe.positionY,
      pipe.width,
      pipe.height
    );
    pipe.positionX = pipe.positionX + pipeVelocity;
  });

  requestAnimationFrame(update);
}

function moveBird(e) {
  if (e.code === "Space") {
birdYvelocity=-5;  }
}