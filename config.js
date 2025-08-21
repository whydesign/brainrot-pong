export default {
  "canvas": "gameCanvas", // Canvas Element ID
  "block_size": 42, // Window Width / Block Size
  "block_raster": false, // Show (=true) or hide (=false) raster lines
  "ball_size": 42, // Window Width / Ball Size
  "ball_speed": 3.5, // Number between 1 and 10
  "ball_rectangle": true, // Ball is rectangle (=true) or circle (=false)
  "colors": { // Define colors in RGB
    "block_white": [231, 230, 229],
    "block_black": [35, 33, 32],
    "block_raster": [0, 128, 0],
    "ball_white": [231, 230, 229],
    "ball_black": [35, 33, 32]
  },
  "scanline": {
    "active": true, // Show (=true) or hide (=false) CRT-Scanlines
    "animation": false, // Enable/Disable Scanline Flicking Animation (requires active=true)
    "opacity": 0.5, // Transparency for the scanlines from 0 to 1
  }
}