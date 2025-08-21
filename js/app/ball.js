// ball.js
import ObjectClass from './objectclass.js';
import Config from '../../config.js';

const window_width = Math.floor(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 100);
const window_height = Math.floor(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 100);

class Ball extends ObjectClass.extend() {
    new(color) {
        this.width = window_width / Config.ball_size;
        this.height = this.width;
        this.respawn_counter = 0;
        this.color_name = color;

        if (color === "white") {
            this.color = Config.colors.ball_white;
        } else if (color === "black") {
            this.color = Config.colors.ball_black;
        } else {
            throw new Error("color not white or black");
        }

        this.reset_pos();
        this.reset_speed();
    }

    update(dt) {
        this.x += this.x_speed * dt;
        this.y += this.y_speed * dt;
        this.check_boundaries();
    }

    paddle_hit(player) {
        if (this.check_collision(player)) {
            this.y_speed = -this.y_speed;
            if (keys["ArrowLeft"]) {
                this.x_speed -= 0.3 * player.speed;
            } else if (keys["ArrowRight"]) {
                this.x_speed += 0.3 * player.speed;
            }
        }
    }

    check_boundaries() {
        if (this.x < 0) {
            this.x_speed = -this.x_speed;
            this.x = 0;
        }
        if (this.x + this.width > window_width) {
            this.x_speed = -this.x_speed;
            this.x = window_width - this.width;
        }
        if (this.y < 0) {
            this.y_speed = -this.y_speed;
            this.y = 0;
        }
        if (this.y + this.height > window_height) {
            this.y_speed = -this.y_speed;
            this.y = window_height - this.height;
        }
    }

    reset_pos() {
        if (this.color_name === "white") {
            this.x = 0;
        } else if (this.color_name === "black") {
            this.x = window_width;
        } else {
            throw new Error("self.color_name not white or black");
        }
        this.y = window_height / 2;
    }

    reset_speed() {
        const angle = Math.random() * 6.28;
        const angle2 = Math.random() * 6.28;
        const base_multiplier = 400;
        if (this.color_name === "white") {
            this.y_speed = -base_multiplier * Math.sin(angle);
            this.x_speed = base_multiplier;
        } else if (this.color_name === "black") {
            this.y_speed = -base_multiplier * Math.sin(angle2);
            this.x_speed = -base_multiplier;
        }
    }

    checkCollision(other) {
        return (
            this.x + this.width > other.x &&
            this.x < other.x + other.width &&
            this.y + this.height > other.y &&
            this.y < other.y + other.height
        );
    }

    blockHit(block) {
        if (this.x + this.width > block.x + block.width) {
            this.x_speed = -this.x_speed;
            this.x = block.x + block.width + 1;
        } else if (this.x < block.x) {
            this.x_speed = -this.x_speed;
            this.x = block.x - this.width - 1;
        } else if (this.y < block.y) {
            this.y_speed = -this.y_speed;
            this.y = block.y - this.height - 1;
        } else if (this.y > block.y + block.height) {
            this.y_speed = -this.y_speed;
            this.y = block.y + block.height + 1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;

        if (Config.ball_rectangle) {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI, false);
            ctx.fill();
        }
    }
}

export default Ball;
