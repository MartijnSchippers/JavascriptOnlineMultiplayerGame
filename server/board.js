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

    isInBounds(x, y) {
        return x >= 0 && x < this.numCells && y >= 0 && y < this.numCells;
    };

    numMatches(x, y, dx, dy) {
        let i = 1;
        while (this.isInBounds(x + dx * i, y + dy * i) && this.board[y][x] == this.board[y + i * dy][x + i * dx]) {
            i++;
        }
        return i - 1;
    };

    fiveInARow(x, y) {
        return (this.numMatches(x, y, -1, 0) + this.numMatches(x, y, 1, 0)) >= 4
        || (this.numMatches(x, y, 0, -1) + this.numMatches(x, y, 0, 1) >= 4)
        || (this.numMatches(x, y, 1, 1) + this.numMatches(x, y, -1, -1) >= 4)
        || (this.numMatches(x, y, -1, 1) + this.numMatches(x, y, 1, -1) >= 4)
    };

}

module.exports = Board;