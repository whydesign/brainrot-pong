// block.js
import ObjectClass from './objectclass.js';
import Config from '../../config.js';

const window_width = Math.floor(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 100);

class Block extends ObjectClass.extend() {
    new(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = window_width / Config.block_size;
        this.height = this.width;
        this.color = color;
    }

    draw(ctx) {
        if (Config.block_raster) {
            ctx.fillStyle = `rgb(${Config.colors.block_raster[0]}, ${Config.colors.block_raster[1]}, ${Config.colors.block_raster[2]})`;
        }

        ctx.fillRect( this.x - 1, this.y - 1, this.width + 1, this.height + 1);
        ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Block;
