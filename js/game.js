
var game = new Phaser.Game(600, 800, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

//  Dimensions
var previewSize = 6;
var spriteWidth = 20;
var spriteHeight = 20;

//  Drawing Area
var canvas;
var canvasBG;
var canvasGrid;
var canvasSprite;
var canvasZoom = 20;

// block
var blockName = ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var BLOCK_CNT = blockName.length;
var SIZE_ONE_BLOCK = 20;


function preload() {
    for (var i = 0; i < BLOCK_CNT; ++i) {
        game.load.image('one_' + blockName[i], 'assets/one_' + blockName[i] + '.png');
        game.load.image('whole_' + blockName[i], 'assets/whole_' + blockName[i] + '.png');
    }
}

function create() {

    //   So we can right-click to erase
    document.body.oncontextmenu = function () { return false; };

    //Phaser.Canvas.setUserSelect(game.canvas, 'none');
    //Phaser.Canvas.setTouchAction(game.canvas, 'none');

    game.stage.backgroundColor = '#301020';


    createDrawingArea();

    var sumWidth = 0;
    for (var i = 0; i < BLOCK_CNT; ++i) {
        var block = createBlock(blockName[i]);
        block.x += sumWidth;
        sumWidth += block.width;
    }    
}

function fixLocation(item) {

    //item.x -= 8;
    //item.y += 6;

}

function update() {

}

function createBlock(blockType) {
    var moveF = game.add.sprite(0, 0, 'whole_' + blockType);
    moveF.inputEnabled = true;
    moveF.input.enableDrag();
    moveF.input.enableSnap(SIZE_ONE_BLOCK, SIZE_ONE_BLOCK, false, true);
    moveF.events.onDragStop.add(fixLocation);

    return moveF;
}


function createDrawingArea() {

    game.create.grid('drawingGrid', 16 * canvasZoom, 16 * canvasZoom, canvasZoom, canvasZoom, 'rgba(0,191,243,0.8)');

    canvas = game.make.bitmapData(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
    canvasBG = game.make.bitmapData(canvas.width + 2, canvas.height + 2);

    canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#fff');
    canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#3f5c67');

    var x = 18;
    var y = 59;

    canvasBG.addToWorld(x, y);
    canvasSprite = canvas.addToWorld(x + 1, y + 1);
    
    // checkline
    canvasGrid = game.add.sprite(x + 1, y + 1, 'drawingGrid');
    canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));

}

