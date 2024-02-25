class Board {
    board;

    constructor(numCells) {
        this.numCells = numCells;
        this.clear();
    }

    clear() {
        this.board = Array(this.numCells).fill().map(() => Array(this.numCells).fill(null));
    };

    getBoard() {
        return this.board;
    };

    getSize() {
        return this.numCells;
    }

    makeTurn(x, y, color) {
        this.board[y][x] = color;
    };

}

module.exports = Board;