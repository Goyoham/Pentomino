
var canvasZoom = 20;
var gridNum = 0;
function createDrawingArea(spriteWidth, spriteHeight, offsetX, offsetY) {
    //  Drawing Area
    var canvas;
    var canvasBG;
    var canvasGrid;
    var canvasSprite;

    var gridName = 'drawingGrid'+(gridNum++);
    // draw play board
    game.create.grid(gridName, spriteWidth * canvasZoom, spriteHeight * canvasZoom, canvasZoom, canvasZoom, 'rgba(0,191,243,0.8)');

    canvas = game.make.bitmapData(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
    canvasBG = game.make.bitmapData(canvas.width + 2, canvas.height + 2);

    canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#fff');
    canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#000000');

    //offset
    var x = offsetX - 1;
    var y = offsetY - 1;

    canvasBG.addToWorld(x, y);
    canvasSprite = canvas.addToWorld(x + 1, y + 1);

    // checkline
    canvasGrid = game.add.sprite(x + 1, y + 1, gridName);
    canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));

}