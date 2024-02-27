// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = new Player(canvas.width / 2, canvas.height / 2, 10, 5, 'white');
const bullets = [];
const bulletSpeed = 5;

const tileSize = 20;  // Set the tileSize according to your preference
const map = new Map(tileSize, canvas.width / tileSize, canvas.height / tileSize);

function drawBullets() {
    ctx.fillStyle = 'red';
    for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, 5, 5);
    }
}

function update() {
    player.move(keys, map);

    bullets.forEach(bullet => {
        bullet.move();
    });

    bullets.forEach((bullet, index) => {
        if (bullet.isOutOfBounds(canvas)) {
            bullets.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    map.drawWalls(ctx);
    drawBullets();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - canvas.offsetTop - player.y, e.clientX - canvas.offsetLeft - player.x);
    const speedX = bulletSpeed * Math.cos(angle);
    const speedY = bulletSpeed * Math.sin(angle);

    bullets.push(new Bullet(player.x + player.radius * Math.cos(angle), player.y + player.radius * Math.sin(angle), speedX, speedY));
});

gameLoop();