class Map {
    

    constructor(tileSize, width, height) {
        this.tileSize = tileSize;
        this.width = width;             // total width
        this.height = height;           // total height
        this.obstacles = [];
        this.wall = new Image();
        this.wall.src = 'scripts/sprites/wall.png';
        // this.wall.src = 'https://i.ibb.co/Ybk7y06/character.png';

        // Initialize the 2D array with null values
        for (let i = 0; i < height; i++) {
            this.obstacles[i] = [];
            for (let j = 0; j < width; j++) {
                this.obstacles[i][j] = null;
            }
        }
    }

    // Method to add a wall at specified coordinates
    addWall(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.obstacles[y][x] = 1;
        }
    }

    // Method to check if a position is blocked by a wall
    isBlocked(x, y) {
        return this.obstacles[y][x] === 1;
    }

    pixelPointsToCoord(x, y) { 
        return {
            x: Math.floor(x / this.tileSize), 
            y: Math.floor(y / this.tileSize)
        }
    }

    // x and y are pixel points
    isLegitMove(x, y, ctx, radius = 1) {
        // tranform pixel points to coordinates\
        x = x / this.tileSize;
        y = y / this.tileSize;
        
        // check if coords are in range of the map walls
        let xMin = Math.floor(x - (radius / this.tileSize));
        let xMax = Math.ceil(x + (radius / this.tileSize));
        let yMin = Math.floor(y - (radius / this.tileSize));
        let yMax = Math.ceil(y + (radius / this.tileSize));

        for (let xCor = xMin; xCor < xMax; xCor++) {
            for (let yCor = yMin; yCor < yMax; yCor++) {
                // // FOR DEBUGGING: draw walls that cannot be in range
                // ctx.fillStyle = 'red';
                // ctx.fillRect(xCor * this.tileSize, yCor * this.tileSize, this.tileSize, this.tileSize);

                // ctx.strokeStyle = '#000'; // Set the stroke color for the border
                // ctx.lineWidth = 2; // Set the border width
                // ctx.strokeRect(xCor * this.tileSize, yCor * this.tileSize, this.tileSize, this.tileSize);
                // cehck if in range of map
                if (xCor >= 0 && xCor < this.width && yCor >= 0 && yCor < this.height) {
                    // check if there already is a block
                    if (this.obstacles[yCor][xCor] == 1) {
                        return false;
                    }
                }
            }
            
        }

        return true;

    }

    // Method to draw the walls on the canvas
    drawWalls(ctx) {
        ctx.fillStyle = 'gray';
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.obstacles[i][j] === 1) {
                    ctx.drawImage(this.wall, j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize)
                    // ctx.fillRect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }
}