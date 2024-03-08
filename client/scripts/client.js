const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// const randomColor = require('randomcolor');

// const Player = new Player;
const player = new Player(canvas.width / 2, canvas.height / 2, 15);
const map = new Map(20, canvas.width, canvas.height);


// hard coding the map
var wall_coord = [
    // Outer square
    [5, 5], [5, 6], [5, 7], [5, 8], [5, 9],
    [6, 5], [7, 5], [8, 5], [9, 5],
    [9, 6], [9, 7], [9, 8], [9, 9],
    [6, 9], [7, 9], [8, 9],

    // Inner square
    [7, 7], [7, 8], [8, 7], [8, 8],

    // Another structure
    [15, 5], [15, 6], [15, 7],
    [16, 5], [17, 5], [18, 5],
    [18, 6], [18, 7],

    // Yet another structure
    [25, 5], [25, 6], [25, 7], [25, 8],
    [26, 5], [27, 5], [28, 5],
    [28, 6], [28, 7], [28, 8]
];


for (var i = 0; i < wall_coord.length; i++) {
    map.addWall(wall_coord[i][0], wall_coord[i][1]);
}

// for (let wallsY = 5; wallsY < 18; wallsY++) {
//     map.addWall(5, wallsY);
// }

// for (let wallsX = 15; wallsX < 20; wallsX++) {
//     map.addWall(wallsX, 5);
// }

// const player = {
//     x: canvas.width / 2,
//     y: canvas.height / 2,
//     size: 15,
//     speed: 5,
//     color: "#" + Math.floor(Math.random()*16777215).toString(16)
// };

const bullets = [];
const bulletSpeed = 10;


function drawMap() {
    map.drawWalls(ctx);
}

function drawPlayer() {
    player.draw(ctx);
}

function drawBullets() {
    ctx.fillStyle = 'red';
    for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, 5, 5);
    }
}

function update() {
    // move the player
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nextPlayerPos = player.getNextLoc(keys);
    if (map.isLegitMove(nextPlayerPos.x, nextPlayerPos.y, ctx, 15)) {
        player.move(nextPlayerPos.x, nextPlayerPos.y);
    }

    // move the bullets
    bullets.forEach((bullet, index) => {
        if (map.isLegitMove(bullet.x, bullet.y, ctx, bullet.radius)) {
            bullet.move();
        } else {
            bullets.splice(index, 1);
        }
    });

    // bullets.forEach((bullet, index) => {
    //     if (bullet.isOutOfBounds(canvas)) {
    //         bullets.splice(index, 1);
    //     }
    // });
}

function draw() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPlayer();    
    drawBullets();
    // drawBullets();
}

// main loop function
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ') {
        bullets.push({
            x: player.x,
            y: player.y,
        });
    }
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


// insert io listeners here
(() => {

    // canvas.addEventListener('click', onClick);
})();