var SCREEN_WIDTH = 1080;
var SCREEN_HEIGHT = 1500;

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

    game.load.image('hintBlock', 'assets/hintBlock.png');

    // buttons
    game.load.spritesheet('btn_hint', 'assets/btn_hint.png', 90, 90);
    game.load.spritesheet('btn_flip', 'assets/btn_flip.png', 160, 39);

    game.load.spritesheet('btn_board1', 'assets/btn_board1.png', 90, 90);
    game.load.spritesheet('btn_board2', 'assets/btn_board2.png', 90, 90);    
    game.load.spritesheet('btn_play1', 'assets/btn_play1.png', 90, 90);
    game.load.spritesheet('btn_back', 'assets/btn_back.png', 90, 90);
    game.load.spritesheet('btn_ranking', 'assets/btn_ranking.png', 90, 60);

    // facebook
    game.load.spritesheet('btn_login_fb', 'assets/btn_login_fb.png', 123, 39);
    game.load.spritesheet('btn_logout_fb', 'assets/btn_logout_fb.png', 143, 39);

    // fonts
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
    // 패턴 로드
    //patternData.ReadData();    
    // 블럭 만들기
    blockMgr.InitBlockForms();

    //mainPage.ShowMainPage();
    _gameState.SetState(state.MainPage);
    mainPage.ready = true;
    // text message
    //textMessage.createText();
    // 게임 생성
    //createGameMgr.createRandomGame();

    // buttons
    // //game.add.button(0, 0, 'btn_random', onUpRandom, this, 2, 1, 0);
    // game.add.button(360-120, 0, 'btn_NextLevel', onUpNextLevel, this, 2, 1, 0);
    // game.add.button(0, 0, 'btn_SameLevel', onUpSameLevel, this, 2, 1, 0);
    // game.add.button(150, 0, 'btn_hint', onUpHint, this, 2, 1, 0);
    // //game.add.button(SCREEN_WIDTH-160, 0, 'btn_flip', onUpFlip, this, 2, 1, 0); // isFlipGame


    // 모든 경우의 수 계산
    //verifyGame.verify();
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
function onUpFlip(button, pointer, isOver) {
    blockMgr.FlipLastClickedBlock();
}