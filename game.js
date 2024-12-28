// Jeu de type Dino Run
class DinoGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        // Configuration du personnage
        this.dino = {
            x: 50,
            y: this.height - 100,
            width: 50,
            height: 50,
            jumpHeight: 150,
            jumpSpeed: 5,
            isJumping: false,
            groundLevel: this.height - 100
        };

        // Configuration des obstacles
        this.obstacles = [];
        this.obstacleSpeed = 5;
        this.score = 0;
        this.gameOver = false;

        // Écouteurs d'événements
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.dino.isJumping) {
                this.jump();
            }
        });
    }

    jump() {
        if (!this.dino.isJumping) {
            this.dino.isJumping = true;
            let jumpCount = 0;
            const jumpInterval = setInterval(() => {
                if (jumpCount < this.dino.jumpHeight / this.dino.jumpSpeed) {
                    // Monter
                    this.dino.y -= this.dino.jumpSpeed;
                    jumpCount++;
                } else if (jumpCount < (this.dino.jumpHeight / this.dino.jumpSpeed) * 2) {
                    // Descendre
                    this.dino.y += this.dino.jumpSpeed;
                    jumpCount++;
                } else {
                    // Fin du saut
                    this.dino.y = this.dino.groundLevel;
                    this.dino.isJumping = false;
                    clearInterval(jumpInterval);
                }
            }, 20);
        }
    }

    generateObstacle() {
        const obstacleTypes = [
            { width: 30, height: 50, color: 'green' },  // Petit cactus
            { width: 40, height: 70, color: 'red' }     // Oiseau
        ];
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        
        this.obstacles.push({
            x: this.width,
            y: this.height - type.height - 50,
            width: type.width,
            height: type.height,
            color: type.color
        });
    }

    update() {
        // Augmenter le score
        this.score++;

        // Générer des obstacles
        if (this.score % 100 === 0) {
            this.generateObstacle();
        }

        // Déplacer les obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.obstacleSpeed;

            // Supprimer les obstacles hors de l'écran
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
            }

            // Vérifier les collisions
            if (this.checkCollision(this.dino, obstacle)) {
                this.gameOver = true;
            }
        });

        // Augmenter progressivement la difficulté
        if (this.score % 500 === 0) {
            this.obstacleSpeed += 0.5;
        }
    }

    checkCollision(player, obstacle) {
        return !(
            player.x > obstacle.x + obstacle.width ||
            player.x + player.width < obstacle.x ||
            player.y > obstacle.y + obstacle.height ||
            player.y + player.height < obstacle.y
        );
    }

    draw() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Dessiner le sol
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(0, this.height - 50, this.width, 50);

        // Dessiner le personnage
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);

        // Dessiner les obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        // Afficher le score
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    start() {
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        } else {
            this.showGameOver();
        }
    }

    showGameOver() {
        const gameOverScreen = document.getElementById('game-over-screen');
        const finalScoreElement = document.getElementById('final-score');
        finalScoreElement.textContent = this.score;
        gameOverScreen.style.display = 'flex';
    }
}

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const gameOverScreen = document.getElementById('game-over-screen');

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        const game = new DinoGame(canvas);
        game.start();
    });

    restartButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        const game = new DinoGame(canvas);
        game.start();
    });
});
