// server/server.js
const hostname = '192.168.2.10';
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const randomColor = require('randomcolor');
// const Board = require('./board.js')
const Bullet = require('./bullet.js');
const Map = require('./map.js');
const Player = require('./player.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../client')));

var bulletCount = 0;


// Init a map
const map1 = new Map('map1');
// const player = new Player(400, 200, 15);
// console.log("JSON info map1:", map1.getInfoJSON());
const players = {};
const bullets = [];


function removeBullet(bulletIndex) {
  io.emit('removeBullet', bullets[bulletIndex]);
  bullets.splice(bulletIndex, 1);
  console.log('a bullet has been removed');
}

// client-server functions
io.on('connection', (socket) => {
  // const color = randomColor();
  console.log('A user connected');
  
  // Handle disconnection
  socket.on('disconnect', () => {
    delete players[socket.id];
    console.log('User disconnected with ID ', socket.id);

    // send a message that the player is disconnected
    io.emit('playerDelete', socket.id);
  });

  // update the player based on its info
  socket.on('playerInfo', (playerInfo) => {
    let player = players[socket.id];
    if (player == null) return;
    players[socket.id].move(playerInfo.x, playerInfo.y);
    // io.emit('playersInfo', players);
  });

  socket.on('shoot', (bullet) => {
    bullets.push(new Bullet(bulletCount, bullet.x, bullet.y, bullet.speedX, bullet.speedY));
    bulletCount++;
    io.emit('bulletAdded', bullet);
  });

  // connect the player
  socket.on('initGame', (frontendGameInfo) => {
    // make the new player
    players[socket.id] = new Player(400, 200, 15, frontendGameInfo.username);

    // send the state of the game when the player joins
    socket.emit('initGameState', {'map': map1, 'players': players});

    // send the new user to all clients
    io.emit('playersInfo', players);
  });
  
});

// emit player info
setInterval(() => {
  // update bullets
  bullets.forEach((bullet, index) => {
    bullet.move();
    // check if the bullets touch a player
    for (const playerId in players) {
      let player = players[playerId];
      
      if (player.hasBeenHit(bullet.x, bullet.y, bullet.radius)) {
        // remove player
        delete players[playerId];
        bullets.splice(index, 1);
        io.emit('playerDied', playerId);
      }
      
    }

    // check if the bullets are out of the map or touch a wall
    if (map1.isLegitMove(bullet.x, bullet.y, bullet.radius) == false) {
      removeBullet(index);
    }
  });

  // send player info
  io.emit('playersInfo', players);
  // io.emit('bullets', bullets);
}, 15);

const PORT = process.env.PORT || 3000;
// const localIP = '192.168.2.10';
// server.listen(PORT, localIP, () => {
  server.listen(PORT, () => {
  console.log(`Server is running on http://${localIP}:${PORT}`);
});