class Player {
    constructor(x, y, radius, speed, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    move(keys, map) {
        const futureX = this.x + (keys['ArrowRight'] ? this.speed : 0) - (keys['ArrowLeft'] ? this.speed : 0);
        const futureY = this.y + (keys['ArrowDown'] ? this.speed : 0) - (keys['ArrowUp'] ? this.speed : 0);
        // Check for collisions with walls
        if (!map.isBlocked(futureX, this.y)) {
            this.x = futureX;
        }

        if (!map.isBlocked(this.x, futureY)) {
            this.y = futureY;
        }
    }
}
