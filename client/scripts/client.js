const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// const randomColor = require('randomcolor');

// const Player = new Player;
var player;
var map;// = new Map(20, canvas.width, canvas.height);

let mapInit = false;

var bullets = [];
const bulletSpeed = 10;
const players = {};


function getMyPlayer() {
    return players[socket.id];
}

function deletePlayer(playerId) {
    delete players[playerId];
}

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.drawWalls(ctx);
}

function drawPlayers() {
    for (const key in players) {
        players[key].draw(ctx);
    }
}

function drawBullets() {
    ctx.fillStyle = 'red';
    for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, 5, 5);
    }
}

function initMap(jsonMapData) {
    let obs = (jsonMapData["obstacles"]);
    map = new Map(jsonMapData['tileSize'], jsonMapData['width'], jsonMapData['height']);
    for (var y = 0; y < obs.length; y++) {
        for (var x = 0; x < obs[y].length; x++) {
            if (obs[y][x] == 1) {
                map.addWall(x, y);
            }
        }
    }
}

function initPlayers(playersInfo) {
    for (const key in playersInfo) {
        const aPlayer = playersInfo[key];
        let myId = socket.id;
        console.log('my id ', myId);
        let newPlayer = new Player(aPlayer.x, aPlayer.y, aPlayer.radius, aPlayer.name, aPlayer.color);
        if(key == myId) {
            player = newPlayer;
        }
        players[key] = newPlayer;
    }
}

function playerDied(playerId) {
    // in the future, more logic can be added
    // check if you just died
    if (playerId == socket.id) {
        mapInit = false;
        drawMap();
        alert('you died. Please refresh');
    }
    delete players[playerId];
}

function updatePlayers(playersInfo) {
    for (const key in playersInfo) {
        if (key != socket.id) {
            const thePlayer = playersInfo[key];
            // create a new player if there exists none
            if (players[key] == null) {
                players[key] = new Player(thePlayer.x, thePlayer.y, thePlayer.radius, thePlayer.name, thePlayer.color);
            } else {
                players[key].move(thePlayer.x, thePlayer.y);
            }
        }
    }

    // delete front-end players that are not relevant
    for (const key in players) {
        if (! playersInfo[key]) {
            delete players[key];
        }
    }

}

function updateBullets(bulletsInfo) {
    bullets = [];
    bulletsInfo.forEach((bullet, index) => {
        bullets[index] = new Bullet(bullet.x, bullet.y, bullet.speedX, bullet.speedY);
    });
    // bullets = bulletsInfo;
}
function initGame(gameState) {
    console.log('this is the game state: ', gameState);
    initMap(gameState.map);
    initPlayers(gameState.players);
    mapInit= true;
}

function update() {
    // move the player
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
    drawPlayers();    
    drawBullets();
    // drawBullets();
}

// main loop function
function gameLoop() {
    // run the game only if its initialized
    if (mapInit) {
        update();
        draw();
    }

    // become a main loop
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
    let bullet = new Bullet(player.x + player.radius * Math.cos(angle), player.y + player.radius * Math.sin(angle), speedX, speedY);
    bullets.push(bullet);

    socket.emit('shoot', bullet);
    console.log('shoot');
});

gameLoop();

setInterval( () => {
    if (initGame) {
        socket.emit('playerInfo', {x: player.x, y: player.y});
    }
}, 15);

// insert io listeners here
(() => {
    socket.on('map', (mapData) => {
        initMap(mapData);
    });

    socket.on('initGameState', (gameState) => {
        initGame(gameState);
    });

    socket.on('playersInfo', (playersInfo) => {
        updatePlayers(playersInfo)
    });

    socket.on('playerDelete', (playerId) => {
        deletePlayer(playerId);
    });

    socket.on('bullets', (bullets) => {
        updateBullets(bullets);
    });

    socket.on('playerDied', (playerId) => {
        playerDied(playerId);
    });
})();