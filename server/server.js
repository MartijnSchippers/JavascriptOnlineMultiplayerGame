// server/server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const randomColor = require('randomcolor');
const Board = require('./board.js');
const createCooldown = require('./create-cooldown.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../client')));

// create a board
const board = new Board(30);

io.on('connection', (socket) => {
  const color = randomColor();
  console.log('A user connected');
  io.emit('welcome message', 'a new user joined');
  socket.emit('board', board.getBoard());

  // cooldown
  const coolDown = createCooldown(500);

  // Listen for chat messages from clients
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Receive a canvas draw, and emit to everyone
  socket.on('fillCanvas', (data) => {
    if (coolDown()) {
      board.makeTurn(data.x, data.y, color);
      io.emit('fillCanvas', {data, color});
      if (board.fiveInARow(data.x, data.y) == true) {
        board.clear();
        socket.emit('chat message', 'You won');
        io.emit('chat message', 'new round');
        io.emit('board');
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
