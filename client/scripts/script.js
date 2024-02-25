const socket = io();

// function log messages that are incoming
const log = (text) => {
    const messages = document.getElementById('messages');
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(text));
    messages.appendChild(li);
}

// function handles messages when a user joins
const newUserJoin = log;

// function send chat message form this user
const emitMsg = (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('m');
    const message = messageInput.value.trim();
    if (message) {
    // Emit the chat message to the server
    socket.emit('chat message', message);
    messageInput.value = '';
    }
}

// all functions related to the board
const getBoard = (canvas, numCells = 30) => {
    const ctx = canvas.getContext('2d');
    const cellSize = Math.floor(canvas.width / numCells);

    const fieldCoordinatesFromReal = (x, y) => {
        return {
            x: Math.floor(x / cellSize),
            y: Math.floor(y / cellSize)
        };
    }

    // field coordinates!
    const fillCell = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    };

    const drawGrid = () => {
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        // vertical lines
        for (let i = 0; i <= numCells; i++) {
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, cellSize * numCells);
        }
        // horizontal lines
        for (let y = 0; y <= numCells; y++) {
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(cellSize * numCells, y * cellSize);
        }
        ctx.stroke();
    };

    const clear = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const renderBoard = (board = []) => {
        board.forEach((row, y) => {
            row.forEach((color, x) => {
                color && fillCell(x, y, color);
            });
        });
    };

    const reset = (board) => {
        clear();
        drawGrid();
        renderBoard(board);
    }

    return { fillRect: fillCell, reset, fieldCoordinatesFromReal };
}

const getClickCoordEle = (element, ev) => {
    const {left: eleX, top: eleY} = element.getBoundingClientRect();
    const {clientX, clientY} = ev;
    return {
        x: clientX - eleX, 
        y: clientY - eleY
    };
};


// main function
(() => {
    // Handle form submission
    document.getElementById('form').addEventListener('submit', emitMsg);

    const canvas = document.querySelector('canvas');
    const { fillRect, reset, fieldCoordinatesFromReal } = getBoard(canvas);
    socket.on('board', reset);

    // Handle incoming chat messages
    socket.on('chat message', log);

    // Handle new user
    socket.on('welcome message', log);

    // Handle when a players did a drawing
    
    socket.on('fillCanvas', ({data, color}) => {
        fillRect(data.x, data.y, color);
    });

    const onClick = (e) => {
        const {x, y} = getClickCoordEle(canvas, e);
        socket.emit('fillCanvas', fieldCoordinatesFromReal(x, y));
    };

    canvas.addEventListener('click', onClick);
})();