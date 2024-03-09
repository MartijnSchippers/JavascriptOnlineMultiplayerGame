const fs = require('fs');

class Map {
    

    constructor(mapTitle) {
        // MAKE THESE DYNAMIC IN THE FUTURE
        this.title = mapTitle;
        this.tileSize = 20;
        this.width = 800 / 20;             // total width
        this.height = 400 / 20;           // total height
        this.obstacles = [];

        // Initialize the 2D array with null values
        // TODO: change to coord values
        for (let i = 0; i < this.height; i++) {
            this.obstacles[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.obstacles[i][j] = null;
            }
        }

        // obatain the map
        try {
            var mapObjs = this.getMap(mapTitle);            // objects
            console.log(" objects: ", mapObjs);
            console.log(mapObjs.length);
            for (let i = 0; i < mapObjs.length; i++) {
                let x = mapObjs[i][0];
                let y = mapObjs[i][1];
                this.obstacles[y][x] = 1;
            }
        } catch (err) {
            console.error('Error:', err);
        }
        
    }

    // Read the content of the JSON file
    getMap(mapTitle) {
        try {
            const data = fs.readFileSync('maps.json', 'utf8');
            const jsonData = JSON.parse(data);
            return jsonData[mapTitle];
        } catch (err) {
            console.error('Error reading the file:', err);
            throw err;
        }
    }

    getInfoJSON() {
        return {
            width: this.width,
            height: this.height,
            objects: this.obstacles
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
        // check if out of map
        // console.log(x-radius, y-radius);
        if ( (x - radius) < 0 || (x + radius) > this.width || (y - radius) < 0 || (y + radius) > this.height) {
            
            return false;
        }
        
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
}

module.exports = Map;