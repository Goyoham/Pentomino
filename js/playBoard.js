
//  Dimensions
var previewSize = 6;
var spriteWidth = 15;
var spriteHeight = 5;
var boardOffsetX = 120;
var boardOffsetY = 280;

var playBoard;

//  Drawing Area
var canvas;
var canvasBG;
var canvasGrid;
var canvasSprite;
var canvasZoom = 20;

function createDrawingArea() {
    // board array
    playBoard = new Array(spriteWidth);
    for (var i = 0; i < spriteWidth; ++i) {
        playBoard[i] = new Array(spriteHeight);
    }

    // draw play board
    game.create.grid('drawingGrid', 16 * canvasZoom, 16 * canvasZoom, canvasZoom, canvasZoom, 'rgba(0,191,243,0.8)');

    canvas = game.make.bitmapData(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
    canvasBG = game.make.bitmapData(canvas.width + 2, canvas.height + 2);

    canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#fff');
    canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#000000');

    //offset
    var x = boardOffsetX - 1;
    var y = boardOffsetY - 1;

    canvasBG.addToWorld(x, y);
    canvasSprite = canvas.addToWorld(x + 1, y + 1);

    // checkline
    canvasGrid = game.add.sprite(x + 1, y + 1, 'drawingGrid');
    canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));

}