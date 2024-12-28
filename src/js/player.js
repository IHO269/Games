class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.dy = 0; // Vertical speed
        this.jumpHeight = 15;
        this.gravity = 1.2; // Augmenté pour une descente plus rapide
        this.grounded = true;
    }

    jump() {
        if (this.grounded) {
            this.dy = -this.jumpHeight;
            this.grounded = false;
        }
    }

    update() {
        this.y += this.dy;
        this.dy += this.gravity;

        // Ground collision
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.grounded = true;
            this.dy = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
