
var game = new Phaser.Game(600, 800
    , Phaser.AUTO, 'Pentomino'
    , { preload: preload, create: create, update: update });

//  Dimensions
var previewSize = 6;
var spriteWidth = 15;
var spriteHeight = 5;

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

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.setScreenSize();

    for (var i = 0; i < BLOCK_CNT; ++i) {
        game.load.image('one_' + blockName[i], 'assets/one_' + blockName[i] + '.png');
        game.load.image('whole_' + blockName[i], 'assets/whole_' + blockName[i] + '.png');
    }
}

function create() {
    // 센터로 정렬
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVeritcally = true;
    this.game.scale.refresh();    

    //   So we can right-click to erase
    document.body.oncontextmenu = function () { return false; };

    //Phaser.Canvas.setUserSelect(game.canvas, 'none');
    //Phaser.Canvas.setTouchAction(game.canvas, 'none');

    game.stage.backgroundColor = '#301020';

    createDrawingArea();

    // 블럭 생성 (테스트용)
    var sumX = 40;
    var sumY = 100;
    for (var i = 0; i < BLOCK_CNT*2; ++i) {
        var block = createBlock(blockName[i % BLOCK_CNT]);
        block.x = 60 + sumX * (i % BLOCK_CNT);
        block.y = 240 + sumY * (i % 2);
        if (i >= BLOCK_CNT) {
            block.scale.x *= -1;
            block.y += 200;
        }
    }    
}

function update() {

}

function createBlock(blockType) {
    var block = game.add.sprite(0, 0, 'whole_' + blockType);

    // find anchor to rotate
    var w = block.width / SIZE_ONE_BLOCK;
    var h = block.height / SIZE_ONE_BLOCK;
    w = 0.5 + ((w % 2) * (1 / (w * 2)));
    h = 0.5 + ((h % 2) * (1 / (h * 2)));
    block.anchor.setTo(w, h);
    // input 허용
    block.inputEnabled = true;
    // drag 허용
    block.input.enableDrag();
    // SIZE_ONE_BLOCK 사이즈 마다 딱딱 맞게 배치.
    block.input.enableSnap(SIZE_ONE_BLOCK, SIZE_ONE_BLOCK, false, true);

    // events
    block.events.onDragStart.add(onDragStart, this);
    block.events.onDragUpdate.add(onDragUpdate, this);
    block.events.onDragStop.add(onDragStop, this);
    block.events.onInputDown.add(onInputDown, this);
    block.events.onInputUp.add(onInputUp, this);
    
    block.input.pixelPerfectOver = true;
    //block.input.useHandleCursor = true;

    return block;
}

var dragMovement;
function onDragStart(block, pointer) {
    //console.log('onDragStart');
    dragMovement = 0;
}

function onDragUpdate(block, pointer) {
    //console.log('onDragUpdate');
    dragMovement += 1;
}

function onDragStop(block, pointer) {
    //console.log('onDragStop');
    dragMovement = 0;
}

function onInputDown(block, pointer) {
    //console.log('onInputDown');
}

function onInputUp(block, pointer) {
    //console.log('onInputUp');
    if (dragMovement <= 2) {
        block.angle += 90;
        //block.scale.x *= -1;
    }

}


function createDrawingArea() {

    game.create.grid('drawingGrid', 16 * canvasZoom, 16 * canvasZoom, canvasZoom, canvasZoom, 'rgba(0,191,243,0.8)');

    canvas = game.make.bitmapData(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
    canvasBG = game.make.bitmapData(canvas.width + 2, canvas.height + 2);

    canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#fff');
    canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#000000');

    var x = 18;
    var y = 59;

    canvasBG.addToWorld(x, y);
    canvasSprite = canvas.addToWorld(x + 1, y + 1);
    
    // checkline
    canvasGrid = game.add.sprite(x + 1, y + 1, 'drawingGrid');
    canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));

}

