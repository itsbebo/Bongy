const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 20;
canvas.height = 500;

let player, bullets = [], enemies = [], keys = {}, score = 0, gameRunning = false;

const shootSound = document.getElementById('shootSound');

document.getElementById('start-screen').style.display = 'block';

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-over').style.display = 'none';
  gameRunning = true;
  score = 0;
  bullets = [];
  enemies = [];
  player = {
    x: 0,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    speed: 5
  };
  spawnEnemies();
  update();
}

function restartGame() {
  startGame();
}

function spawnEnemies() {
  for (let i = 0; i < 50; i++) {
    enemies.push({
      x: canvas.width + i * 200,
      y: Math.random() * (canvas.height - 50),
      width: 40,
      height: 40,
      speed: 2 + Math.random() * 2
    });
  }
}

function drawPlayer() {
  ctx.fillStyle = 'lime';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach((b, i) => {
    b.x += 7;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    if (b.x > canvas.width) bullets.splice(i, 1);
  });
}

function drawEnemies() {
  ctx.fillStyle = 'red';
  enemies.forEach((e, ei) => {
    e.x -= e.speed;
    ctx.fillRect(e.x, e.y, e.width, e.height);

    if (e.x + e.width < 0) {
      gameOver(false);
    }

    // تصادم
    bullets.forEach((b, bi) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score += 10;
        if (enemies.length === 0) gameOver(true);
      }
    });
  });
}

function gameOver(won) {
  gameRunning = false;
  document.getElementById('resultText').innerText = won ? 'انتصرت! 🎉' : 'خسرت! 💀';
  document.getElementById('finalScore').innerText = score;
  document.getElementById('game-over').style.display = 'block';
}

function update() {
  if (!gameRunning) return;


  // تحريك اللاعب
  if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
  if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;

  drawPlayer();
  drawBullets();
  drawEnemies();

  // رسم النقاط
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText("النقاط: " + score, 3, 30);

  requestAnimationFrame(update);
}

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === ' ') {
    bullets.push({
      x: player.x + player.width,
      y: player.y + player.height / 2 - 5,
      width: 10,
      height: 5
    });
    shootSound.currentTime = 0;
    shootSound.play();
  }
});

document.addEventListener('keyup', e => keys[e.key] = false);
