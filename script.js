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

birdImg = new Image();
birdImg.src = "/Assets/flappybird.png";

let drawBird = function () {
  context.drawImage(
    birdImg,
    bird.positionX,
    bird.positionY,
    bird.birdWidth,
    bird.birdHeight
  );
};

birdImg.onload = drawBird;

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d");
  board.height = boardHeight;
  board.width = boardWidth;

  requestAnimationFrame(update);
};

function update() {
  context.clearRect(0, 0, board.width, board.height);
  drawBird();
  requestAnimationFrame(update);
}
