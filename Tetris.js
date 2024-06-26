// Definições de constantes e variáveis globais
const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
let board = createBoard();
let currentPiece = getRandomPiece();
let currentPosition = { x: 4, y: 0 };

// Peças do Tetris
const PIECES = [
    { shape: [[1, 1, 1, 1]], color: 'cyan' },    // I
    { shape: [[1, 1], [1, 1]], color: 'yellow' }, // O
    { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' }, // T
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'green' },  // S
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'red' },    // Z
    { shape: [[1, 1, 1], [0, 0, 1]], color: 'blue' },   // J
    { shape: [[1, 1, 1], [1, 0, 0]], color: 'orange' }, // L
];

// Criação do tabuleiro
function createBoard() {
    let board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = '';
        }
    }
    return board;
}

// Obtém uma peça aleatória
function getRandomPiece() {
    let piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
        shape: piece.shape,
        color: piece.color,
        x: Math.floor((COLS - piece.shape[0].length) / 2),
        y: 0
    };
}

// Desenha um bloco no canvas
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Desenha o tabuleiro
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(col, row, board[row][col]);
            }
        }
    }
}

// Desenha uma peça no tabuleiro
function drawPiece(piece, x, y) {
    ctx.fillStyle = piece.color;
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                drawBlock(x + col, y + row, piece.color);
            }
        }
    }
}

// Verifica se há colisões entre a peça e o tabuleiro
function collides(board, piece, position) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col] && (board[position.y + row] && board[position.y + row][position.x + col])) {
                return true;
            }
        }
    }
    return false;
}

// Mescla a peça atual no tabuleiro
function merge(board, piece, position) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                board[position.y + row][position.x + col] = piece.color;
            }
        }
    }
}

// Rotaciona a peça
function rotate(piece) {
    let newShape = [];
    for (let col = 0; col < piece.shape[0].length; col++) {
        let newRow = [];
        for (let row = piece.shape.length - 1; row >= 0; row--) {
            newRow.push(piece.shape[row][col]);
        }
        newShape.push(newRow);
    }
    return {
        shape: newShape,
        color: piece.color
    };
}

// Atualiza a posição da peça
function update() {
    currentPosition.y++;
    if (collides(board, currentPiece, currentPosition)) {
        currentPosition.y--;
        merge(board, currentPiece, currentPosition);
        currentPiece = getRandomPiece();
        currentPosition = { x: 4, y: 0 };
    }
}

// Desenha o jogo
function draw() {
    drawBoard();
    drawPiece(currentPiece, currentPosition.x, currentPosition.y);
}

// Loop do jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Função principal do jogo
function startGame() {
    // Iniciar o loop do jogo
    gameLoop();
}

// Captura de eventos de teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        currentPosition.x--;
        if (collides(board, currentPiece, currentPosition)) {
            currentPosition.x++;
        }
    } else if (event.key === 'ArrowRight') {
        currentPosition.x++;
        if (collides(board, currentPiece, currentPosition)) {
            currentPosition.x--;
        }
    } else if (event.key === 'ArrowDown') {
        currentPosition.y++;
        if (collides(board, currentPiece, currentPosition)) {
            currentPosition.y--;
            merge(board, currentPiece, currentPosition);
            currentPiece = getRandomPiece();
            currentPosition = { x: 4, y: 0 };
        }
    } else if (event.key === 'ArrowUp') {
        let rotatedPiece = rotate(currentPiece);
        if (!collides(board, rotatedPiece, currentPosition)) {
            currentPiece = rotatedPiece;
        }
    }
});

// Iniciar o jogo
startGame();
