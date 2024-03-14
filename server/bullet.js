// Bullet.js
class Bullet {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.radius = 5;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    isOutOfBounds() {
        // TODO: quick fix with magic numbers
        return this.x > 800 || this.x < 0 || this.y > 400 || this.y < 0;
    }    
}

module.exports = Bullet;