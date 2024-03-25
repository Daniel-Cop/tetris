document.addEventListener("DOMContentLoaded", () => {
  // VARIABLES
  const grid = document.querySelector("#game-grid");
  let squares = Array.from(document.querySelectorAll("#game-grid div"));
  const scoreDisplay = document.querySelector("#score");
  const gridWidth = 10;

  let currentPosition = 4;
  let currentRotation = 0;

  // TETROMINOES
  const lTetrominoes = [
    [1, gridWidth + 1, gridWidth * 2 + 1, 2],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 2],
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2],
    [gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2],
  ];
  const zTetrominoes = [
    [gridWidth * 2, gridWidth * 2 + 1, gridWidth + 1, gridWidth + 2],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
    [gridWidth * 2, gridWidth * 2 + 1, gridWidth + 1, gridWidth + 2],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
  ];
  const tTetraminoes = [
    [1, gridWidth, gridWidth + 1, gridWidth + 2],
    [1, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
    [1, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
  ];
  const oTetraminoes = [
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
  ];
  const iTetraminoes = [
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
  ];

  const theTetrominoes = [
    lTetrominoes,
    zTetrominoes,
    tTetraminoes,
    oTetraminoes,
    iTetraminoes,
  ];

  // RANDOM TETROMINO SELECTION
  let randomTetromino = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[randomTetromino][currentRotation]; //current tetramino and his rotation

  // FUNCTIONS

  //timerId = setInterval(moveDown, 1000);

  function control(event) {
    if (event.keyCode === 37) {
      moveLeft();
    } else if (event.keyCode === 38) {
      rotate();
    } else if (event.keyCode === 39) {
      moveRight();
    } else if (event.keyCode === 40) {
      moveDown();
    }
  } //assign function to keyCode

  document.addEventListener("keydown", control);

  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
    });
  } //draw tetromino in the game grid

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
    });
  } //undraw the tetromino

  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + gridWidth].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      randomTetromino = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[randomTetromino][currentRotation];
      currentPosition = 4;
      draw();
    }
  } // stops the falling when touching a taken piece (or the ground) then start another loop

  function moveDown() {
    undraw();
    currentPosition += gridWidth;
    draw();
    freeze();
  } //game loop

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % gridWidth === 0
    ); //check if a part of the tetramino is touching the left edge
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % gridWidth === gridWidth - 1
    ); //check if a part of the tetramino is touching the right edge
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[randomTetromino][currentRotation];
    draw();
  } // rotate the tetramino changing it in his next rotation in his array
});
//https://www.youtube.com/watch?v=rAUn1Lom6dw
// minutaggio: 1h 8m 57s
