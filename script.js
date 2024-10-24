const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreElement = document.getElementById("score");

let isJumping = false;
let gravity = 0.9;
let score = 0;
let gameOver = false;
let gameStarted = false;
let cactusInterval;
let downPressed = false; // Variável para controlar se a tecla para baixo está pressionada

// Função para o dinossauro pular
function jump() {
    if (isJumping) return;

    let position = 0;
    let upSpeed = 5;  // Velocidade de subida
    let downSpeed = 5;  // Velocidade de descida
    isJumping = true;
    let upInterval, downInterval;

    // Subida
    upInterval = setInterval(() => {
        if (position >= 150 || downPressed) {
            // Se chegar ao topo ou a seta para baixo for pressionada, começar a descer imediatamente
            clearInterval(upInterval);

            // Descendo
            downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    // Se a seta para baixo está pressionada, desce mais rápido
                    if (downPressed) {
                        position -= 15;  // Acelerar descida
                    } else {
                        position -= downSpeed;  // Velocidade normal
                    }
                    dino.style.bottom = position + "px";
                }
            }, 20);
        } else {
            // Subindo
            position += upSpeed;
            dino.style.bottom = position + "px";
        }
    }, 20);
}

// Movimentação do cacto
function moveCactus() {
    let cactusPosition = 800;
    cactusInterval = setInterval(() => {
        if (gameOver) return;

        if (cactusPosition < -20) {
            cactusPosition = 800;
            score++;
            scoreElement.textContent = "Score: " + score;
        } else {
            cactusPosition -= 10;
            cactus.style.left = cactusPosition + "px";
        }

        // Verificar colisão
        let dinoRect = dino.getBoundingClientRect();
        let cactusRect = cactus.getBoundingClientRect();

        if (
            dinoRect.left < cactusRect.right &&
            dinoRect.right > cactusRect.left &&
            dinoRect.bottom > cactusRect.top &&
            dinoRect.top < cactusRect.bottom
        ) {
            clearInterval(cactusInterval);
            gameOver = true;
            alert("Game Over! Score: " + score);
            document.location.reload();
        }
    }, 20);
}

// Função para iniciar o jogo
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        moveCactus();
    }
}

// Detecção de teclas para pular, descer e iniciar o jogo
document.addEventListener("keydown", (e) => {
    if (!gameStarted) {
        startGame(); // Inicia o jogo na primeira tecla pressionada
    }

    if (e.key === " " || e.key === "ArrowUp") {
        jump(); // Faz o dinossauro pular
    }

    if (e.key === "ArrowDown" && isJumping) {
        downPressed = true; // Marca que a seta para baixo está pressionada para descer mais rápido
    }
});

// Quando a seta para baixo for solta, desabilitar o "descer rápido"
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowDown") {
        downPressed = false; // A seta para baixo foi solta, volta à descida normal
    }
});
