class Player {
    constructor(x, y, radius, name, color = "#" + Math.floor(Math.random()*16777215).toString(16)) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.name = name;
      this.color = color;
      this.speed = 5;
    }

    getNextLoc(keys) {
        // diagonal directions
        let multiplier = 1;
        let x = this.x;
        let y = this.y;

        if ((keys['w'] && keys['d']) || (keys['w'] && keys['a']) || (keys['s'] && keys['a']) || (keys['s'] && keys['d'])) {
            multiplier = 1 / Math.sqrt(2);
        }

        // horizontal and vertical directions
        if (keys['w'] && this.y > 0 + this.radius) {
            y -= this.speed * multiplier;
        }
        if (keys['s'] && this.y < canvas.height - this.radius) {
            y += this.speed * multiplier;
        }
        if (keys['a'] && player.x > 0 + player.radius) {
            x -= player.speed * multiplier;
        }
        if (keys['d'] && this.x < canvas.width - this.radius) {
            x += this.speed * multiplier;
        }

        return {x: x, y: y}
    }
     
    move(x, y) {
        this.x = x;
        this.y = y;
    }

    hasBeenHit(xBullet, yBullet, radius) {
        let distance = Math.sqrt((xBullet - this.x) ** 2 + (yBullet - this.y) ** 2);
        return (distance < this.radius + radius);
    }
  }
  
module.exports = Player;