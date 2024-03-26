document.addEventListener("DOMContentLoaded", () => {
  // VARIABLES
  const grid = document.querySelector("#game-grid");
  let squares = Array.from(document.querySelectorAll("#game-grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const gridWidth = 10;

  let timerId;

  const previewSquares = document.querySelectorAll("#preview-grid div");
  const previewWidth = 4;
  const previewIndex = 0;

  let nextRandom = 0;

  let score = 0;
  let currentPosition = 4;
  let currentRotation = 0;

  const colors = ["orange", "red", "purple", "green", "blue"];

  //TETROMINOS IN PREVIEW
  const upNextTetrominoes = [
    [1, previewWidth + 1, previewWidth * 2 + 1, 2], //l
    [
      previewWidth * 2,
      previewWidth * 2 + 1,
      previewWidth + 1,
      previewWidth + 2,
    ], // z
    [1, previewWidth, previewWidth + 1, previewWidth + 2], //t
    [0, 1, previewWidth, previewWidth + 1], //o
    [1, previewWidth + 1, previewWidth * 2 + 1, previewWidth * 3 + 1], //i
  ];

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
      squares[currentPosition + index].style.backgroundColor =
        colors[randomTetromino];
    });
  } //draw tetromino in the game grid

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
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
      randomTetromino = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[randomTetromino][currentRotation];
      currentPosition = 4;
      draw();
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
      addScore();
      freeze();
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

  function displayShape() {
    previewSquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      previewSquares[previewIndex + index].classList.add("tetromino");
      previewSquares[previewIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  } // display the next tetraminoes in the previw grid

  function addScore() {
    for (let i = 0; i < 199; i += gridWidth) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => [index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = square.splice(i, gridWidth);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  } // delete compelted row and add to score

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }

  // EVENTS
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      displayShape();
    }
  });
});
//https://www.youtube.com/watch?v=rAUn1Lom6dw
