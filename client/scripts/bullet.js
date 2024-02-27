class Bullet {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    isOutOfBounds() {
        return this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0;
    }
}
