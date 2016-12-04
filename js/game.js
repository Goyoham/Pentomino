var SCREEN_WIDTH = 400;
var SCREEN_HEIGHT = 600;
var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT
    , Phaser.AUTO, 'Pentomino'
    , { preload: preload, create: create, update: update, render: render });

//----------------- preload -----------------------------------------------------------------
function preload() {
    // fix the scale full on my screen
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.setScreenSize();

    // load blocks
    for (var i = 0; i < blockMgr.BLOCK_CNT; ++i) {
        game.load.image('whole_' + blockMgr.blockName[i], 'assets/whole_' + blockMgr.blockName[i] + '.png');
    }

    game.load.spritesheet('btn_random', 'assets/btn_random.png', 120, 39);
    game.load.spritesheet('btn_flip', 'assets/btn_flip.png', 200, 39);
    game.load.bitmapFont('font_desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
}

//----------------- create -----------------------------------------------------------------
function create() {
    // Disable right-click
    document.body.oncontextmenu = function () { return false; };
    // align center
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVeritcally = true;
    this.game.scale.refresh();
    // back ground
    game.stage.backgroundColor = '#301020';
    createGameMgr.createRandomGame();

    // buttons
    game.add.button(0, 0, 'btn_random', onUpRandom, this, 2, 1, 0);
    game.add.button(SCREEN_WIDTH-200, 0, 'btn_flip', onUpFlip, this, 2, 1, 0);

    // text message
    textMessage.createText();
}

//----------------- update -----------------------------------------------------------------
function update() {
    textMessage.updateClearText();
}

//----------------- render -----------------------------------------------------------------
function render() {

    //game.debug.spriteInputInfo(blockList[0], 32, 32);
    //game.debug.geom(blockList[0].input._tempPoint);

}

// button events
function onUpRandom(button, pointer, isOver) {
   createGameMgr.createRandomGame();
}
function onUpFlip(button, pointer, isOver) {
   blockMgr.FlipLastClickedBlock();
}