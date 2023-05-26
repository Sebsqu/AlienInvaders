document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.querySelector("#game-container");
    const scoreElement = document.querySelector("#score");
    const livesElement = document.querySelector("#lives");
    const gameOverElement = document.querySelector("#game-over");
    const restartButton = document.querySelector("#restart-button");


    let playerLeft = 130;
    const playerSpeed = 6;
    let score = 0;
    let lives = 5;
  
    let isMovingLeft = false;
    let isMovingRight = false;
  
    const poolSize = 5;
    const shootSounds = [];
    for (let i = 0; i < poolSize; i++) {
      const sound = new Audio("shoot.wav");
      shootSounds.push(sound);
    }
  
    const explosionSound = new Audio("explosion.wav");
  
    let currentSoundIndex = 0;
  
    function movePlayer() {
      if (isMovingLeft && playerLeft > player.offsetWidth / 2) {
        playerLeft -= playerSpeed;
      }
      if (
        isMovingRight &&
        playerLeft < gameContainer.offsetWidth - player.offsetWidth / 2
      ) {
        playerLeft += playerSpeed;
      }
  
      player.style.left = `${playerLeft}px`;
    }
  
    const player = document.querySelector(".player");
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        isMovingLeft = true;
      }
      if (event.key === "ArrowRight") {
        isMovingRight = true;
      }
      if (event.key === " ") {
        createBullet();
        playShootSound(); // Odtwarzanie dźwięku po wystrzeleniu
      }
    });
  
    // Funkcja odtwarzająca dźwięk wystrzału
    function playShootSound() {
      const sound = shootSounds[currentSoundIndex];
      sound.currentTime = 0;
      sound.play();
      currentSoundIndex = (currentSoundIndex + 1) % poolSize; // Przejście do kolejnego dźwięku w puli
    }
  
    function playExplosionSound() {
      explosionSound.currentTime = 0;
      explosionSound.play();
    }
  
    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft") {
        isMovingLeft = false;
      }
      if (event.key === "ArrowRight") {
        isMovingRight = false;
      }
    });
  
    let enemies = [];
    let bullets = [];
    let enemySpeed = 2;
  
    function createEnemy() {
      const enemy = document.createElement("img");
      enemy.classList.add("enemy");
      enemy.src = "alien.png";
      enemy.style.top = "0px";
      enemy.style.left = `${Math.floor(
        Math.random() * (gameContainer.offsetWidth - 40)
      )}px`;
      gameContainer.appendChild(enemy);
      enemies.push(enemy);
    }
  
    function moveEnemies() {
      enemies.forEach((enemy, index) => {
        let top = parseInt(enemy.style.top);
        if (top >= gameContainer.offsetHeight - enemy.offsetHeight) {
          gameContainer.removeChild(enemy);
          enemies.splice(index, 1);
          if (--lives === 0) {
            endGame();
          } else {
            updateLives();
          }
        } else {
          enemy.style.top = `${top + enemySpeed}px`;
        }
      });
    }
  
    function createBullet() {
      const bullet = document.createElement("div");
      bullet.classList.add("bullet");
      bullet.style.top = `${gameContainer.offsetHeight - player.offsetHeight - 10}px`;
      bullet.style.left = `${playerLeft + player.offsetWidth / 2 - 1}px`;
      gameContainer.appendChild(bullet);
      bullets.push(bullet);
    }
  
    function moveBullets() {
      bullets.forEach((bullet, index) => {
        let top = parseInt(bullet.style.top);
        if (top <= 0) {
          gameContainer.removeChild(bullet);
          bullets.splice(index, 1);
        } else {
          bullet.style.top = `${top - enemySpeed}px`;
          checkCollision(bullet);
        }
      });
    }
  
    function checkCollision(bullet) {
      enemies.forEach((enemy, enemyIndex) => {
        if (isColliding(bullet, enemy)) {
          gameContainer.removeChild(bullet);
          bullets.splice(bullets.indexOf(bullet), 1);
          gameContainer.removeChild(enemy);
          enemies.splice(enemyIndex, 1);
          score++;
          scoreElement.textContent = `Zestrzelone: ${score}`;
          playExplosionSound();
        }
      });
    }
  
    function isColliding(element1, element2) {
      const rect1 = element1.getBoundingClientRect();
      const rect2 = element2.getBoundingClientRect();
      return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
      );
    }
  
    function updateLives() {
      livesElement.textContent = `Życia: ${lives}`;
      player.style.top = `${gameContainer.offsetHeight - player.offsetHeight}px`;
    }
  
    function endGame() {
        restartButton.removeEventListener("click", resetGame);
        gameContainer.innerHTML = "";
        gameOverElement.textContent = "Koniec gry!";
      }
  
    function gameLoop() {
      if (Math.random() < 0.02) {
        createEnemy();
      }
  
      movePlayer();
      moveEnemies();
      moveBullets();
  
      requestAnimationFrame(gameLoop);
    }
  
    updateLives();
    requestAnimationFrame(gameLoop);
  });
  