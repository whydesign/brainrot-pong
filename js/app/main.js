// main.js
import Ball from './ball.js';
import Block from './block.js';
import Config from '../../config.js';

const root = document.querySelector(':root');
let crt = document.getElementById('crt');
let canvasWrapper = document.querySelector('.canvas-wrapper');
let canvas = document.getElementById(Config.canvas);
let ctx = canvas.getContext('2d');

let vw = Math.floor(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 100);
let vh = Math.floor(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 100);

canvasWrapper.style.width = `${vw}px`;
canvasWrapper.style.height = `${vh}px`;

canvas.width = vw;
canvas.height = vh;

let width = canvas.width;
let height = canvas.height;

const blockColorWhite = Config.colors.block_white;
const blockColorBlack = Config.colors.block_black;

let White_ball, Black_ball;
let White_blocks = [];
let Black_blocks = [];

let count = 0;

var setRootStyles = function() {
    let full_width = Math.floor(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));
    let black_width = count * (width / Config.block_size);
    let with_width = canvas.width - black_width;
    let space_left = (full_width - (canvas.width + 6)) / 2;
    let bg_left = Math.floor(space_left + black_width) + 3;

    document.querySelector('.bg-left').style.width = `${bg_left}px`;

    root.style.setProperty('--left-border-width', `${Math.floor(black_width)}px`);
    root.style.setProperty('--right-border-width', `${Math.floor(with_width)}px`);
    root.style.setProperty('--border-style', 'solid');
    root.style.setProperty('--canvas-overflow', 'visible');
}

function loveLoad() {
    White_ball = new Ball("white");
    Black_ball = new Ball("black");

    let block_width = width / Config.block_size;
    let block_height = block_width;

    // Blöcke auf linker Hälfte
    for (let x = 0; x < width / 2; x += block_width) {
        for (let y = 0; y < height; y += block_height) {
            Black_blocks.push(new Block(x, y, blockColorBlack));
            if (y === 0) {
                count++;
            }
        }
    }

    // Blöcke auf rechter Hälfte
    for (let x = width / 2; x < width; x += block_width) {
        for (let y = 0; y < height; y += block_height) {
            White_blocks.push(new Block(x, y, blockColorWhite));
        }
    }
}

function loveUpdate(dt) {
    White_ball.update(dt);
    Black_ball.update(dt);

    for (let i = 0; i < Black_blocks.length; i++) {
        let block = Black_blocks[i];
        if (Black_ball.checkCollision(block)) {
            Black_ball.blockHit(block);
            Black_blocks.splice(i, 1);
            block.color = blockColorWhite;
            White_blocks.push(block);
            break;
        }
    }

    for (let i = 0; i < White_blocks.length; i++) {
        let block = White_blocks[i];
        if (White_ball.checkCollision(block)) {
            White_ball.blockHit(block);
            White_blocks.splice(i, 1);
            block.color = blockColorBlack;
            Black_blocks.push(block);
            break;
        }
    }
}

function loveDraw() {
    ctx.clearRect(0, 0, width, height);

    for (let block of White_blocks) {
        block.draw(ctx);
    }
    for (let block of Black_blocks) {
        block.draw(ctx);
    }

    White_ball.draw(ctx);
    Black_ball.draw(ctx);
}

// Hauptspiel-Loop
let lastTime = performance.now();
function gameLoop(time) {
    let speed = 100 * Config.ball_size / (vw / Config.ball_speed);
    let dt = (time - lastTime) / (speed * Config.ball_size);
    lastTime = time;

    loveUpdate(dt);
    loveDraw();

    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", function(event) {
    if (Config.scanline.active) {
        crt.classList.add('active');
    }

    if (Config.scanline.animation) {
        crt.classList.add('animation');
    }

    if (Config.scanline.opacity) {
        crt.style.opacity = Config.scanline.opacity;
    }

    document.querySelector('.bg-left').style.backgroundColor = `rgb(${blockColorBlack[0]}, ${blockColorBlack[1]}, ${blockColorBlack[2]})`;
    document.querySelector('.bg-right').style.backgroundColor = `rgb(${blockColorWhite[0]}, ${blockColorWhite[1]}, ${blockColorWhite[2]})`;

    root.style.setProperty('--left-border-color', `rgb(${blockColorWhite[0]}, ${blockColorWhite[1]}, ${blockColorWhite[2]})`);
    root.style.setProperty('--right-border-color', `rgb(${blockColorBlack[0]}, ${blockColorBlack[1]}, ${blockColorBlack[2]})`);


    // Start
    loveLoad();
    requestAnimationFrame(gameLoop);
});

window.onresize = setRootStyles;
window.onload = setRootStyles;
