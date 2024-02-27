// Map.js
class Map {
    constructor(tileSize, width, height) {
        this.tileSize = tileSize;
        this.width = width;             // in number of tiles
        this.height = height;           // in number of tiles
        this.obstacles = [];

        // Initialize the 2D array with null values
        for (let i = 0; i < height; i++) {
            this.obstacles[i] = [];
            for (let j = 0; j < width; j++) {
                this.obstacles[i][j] = null;
            }
        }

        // initial map
        for (let x = 0; x < width - 5; x++) {
            let h = Math.floor(height / 2); // height
            this.obstacles[h][x] = 1;
        }
    }

    // Method to add a wall at specified coordinates
    addWall(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.obstacles[y][x] = 1;
        }
    }

    getCoordinates(x, y) {
        return { 
            x: Math.floor(x / this.width),
            y: Math.floor(y / this.height)
        }
    }

    // Method to check if a position is blocked by a wall
    isBlocked(x, y) {
        let cor = this.getCoordinates(x, y);
        return this.obstacles[cor.y][cor.x] == 1;
    }

    // Method to draw the walls on the canvas
    drawWalls(ctx) {
        ctx.fillStyle = 'gray';
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.obstacles[i][j] === 1) {
                    ctx.fillRect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }
}
