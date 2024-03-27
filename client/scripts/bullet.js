// Bullet.js
class Bullet {
    constructor(id, x, y, speedX, speedY) {
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

    isOutOfBounds(canvas) {
        return this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0;
    }

    
}
