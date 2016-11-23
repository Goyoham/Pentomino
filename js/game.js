var SCREEN_WIDTH = 540;
var SCREEN_HEIGHT = 800;
var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT
    , Phaser.AUTO, 'Pentomino'
    , { preload: preload, create: create, update: update, render: render });

//----------------- preload -----------------------------------------------------------------
function preload() {
    // fix the scale full on my screen
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.setScreenSize();

    // load blocks
    for (var i = 0; i < BLOCK_CNT; ++i) {
        game.load.image('whole_' + blockName[i], 'assets/whole_' + blockName[i] + '.png');
    }
}

//----------------- create -----------------------------------------------------------------
function create() {
    // align center
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVeritcally = true;
    this.game.scale.refresh();

    InitBlockForms();

    //   So we can right-click to erase
    document.body.oncontextmenu = function () { return false; };

    //Phaser.Canvas.setUserSelect(game.canvas, 'none');
    //Phaser.Canvas.setTouchAction(game.canvas, 'none');

    // background color
    game.stage.backgroundColor = '#301020';

    // create play board
    createDrawingArea();

    // create blocks
    createAllBlocks();
}

//----------------- update -----------------------------------------------------------------
function update() {
    mouseOveredBlockToTop();
}

var lastBlockToTop = -1;
function mouseOveredBlockToTop(){
    var len = blockList.length;
    for(var i = 0; i < len; ++i){
        if( lastBlockToTop === i )
            continue;
        if(blockList[i].input.pointerOver())
        {
            game.world.bringToTop(blockList[i]);
            lastBlockToTop = i;
            //console.log(i);
        }
    }
}

//----------------- render -----------------------------------------------------------------
function render() {

    //game.debug.spriteInputInfo(blockList[0], 32, 32);
    //game.debug.geom(blockList[0].input._tempPoint);

}