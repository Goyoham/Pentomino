
function CreateGameMgr(){

}

createGameMgr = new CreateGameMgr();

CreateGameMgr.prototype.canvasZoom = 60;
CreateGameMgr.prototype.gameBoard;
CreateGameMgr.prototype.boardOffset = {x: 0, y:0};
CreateGameMgr.prototype.isClear = false;
CreateGameMgr.prototype.hintList = [];
CreateGameMgr.prototype.currBlockList = '';
CreateGameMgr.prototype.hintSpriteList = [];
CreateGameMgr.prototype.hintNum = -1;
CreateGameMgr.prototype.hintText;

CreateGameMgr.prototype.ObjectList = [];

// draw board
CreateGameMgr.prototype.canvas;
CreateGameMgr.prototype.canvasBG;
CreateGameMgr.prototype.canvasGrid;

// functions utils ------------------------------------------------------------------------------------
CreateGameMgr.prototype.getOffsetCenter = function(blockCnt, screenSize){
	var boardSize = blockCnt * blockMgr.SIZE_ONE_BLOCK;
	var offset = (screenSize - boardSize) / 2;
	var fixedOffset = offset - (offset % blockMgr.SIZE_ONE_BLOCK);
	return fixedOffset;
}

CreateGameMgr.prototype.getRandomBoardSize = function(){
	var size = {width: 0, height: 0};
	do{
		size.width = utils.randomRange(7, 12);
		size.height = utils.randomRange(5, 6);
		var volume = size.width * size.height;
		if( volume > (blockMgr.BLOCK_CNT * blockMgr.BLOCK_VOLUME) )
			continue;
	}while( volume % blockMgr.BLOCK_VOLUME !== 0 )
	return size;
}

// functions members ------------------------------------------------------------------------------------
CreateGameMgr.prototype.ShowGamePage = function(){
	// back button
	var btn_back = game.add.button(0, 0, 'btn_back', this.onUpBack, this, 0, 0, 1);
    btn_back.scale.set(2);
    btn_back.x = SCREEN_WIDTH - btn_back.width;
    this.ObjectList.push(btn_back);

	// game text
	var text = game.add.text(20, 20, mainPage.currGameType, 
		{ font: '72px Arial', fill: '#ffffff', align: 'center'});
	text.stroke = '#c4c4ff';
	text.strokeThickness = 25;
	text.setShadow(2, 2, '#333333', 2, true, true);
	this.ObjectList.push(text);

	this.CreateBtn_Hint();

	// greate text manager
	textMessage.createText();
	// create game
	clientSocket.CreateOfficialGameReq(mainPage.currGameType);
}

CreateGameMgr.prototype.CloseGame = function(){
	textMessage.terminateText();
	this.HideHint();

	for(var i in this.ObjectList){
        this.ObjectList[i].kill();
    }
    this.ObjectList = [];
	this.hintText = 0;

	blockMgr.eraseBlocks();
	if( typeof this.canvas !== 'undefined' )
    {
    	this.canvas.clear();
		this.canvasBG.clear();
		this.canvasGrid.kill();
    }
}

CreateGameMgr.prototype.CreateBtn_Hint = function(){
	var button = game.add.button(400, 0, 'btn_hint', this.onUpHint, this, 0, 0, 1);
	button.scale.x = 3;
	button.scale.y = 2;

	var text = game.add.text(button.x + (button.width/2), button.y + (button.height/2), '', 
		{ font: '48px Arial', fill: '#ffffff', align: 'center'});
	text.anchor.set(0.5);
	text.stroke = '#992255';
	text.strokeThickness = 20;
	text.setShadow(2, 2, '#333333', 2, true, true);
	this.hintText = text;
	this.UpdateHintText();
	
	this.ObjectList.push(button);
	this.ObjectList.push(text);
}

CreateGameMgr.prototype.UpdateHintText = function(){
	if( typeof this.hintText === 'undefined' || this.hintText === 0 )
		return;
	this.hintText.text = 'HINT\n' + clientData.GetHaveHint();
}

CreateGameMgr.prototype.onUpBack = function(){
	// this.CloseGame();
	// choicePage.ShowChoicePage();
	_gameState.SetState(state.ChoicePage);
}

CreateGameMgr.prototype.onUpHint = function() {
    this.ShowHint();
}

CreateGameMgr.prototype.createGame = function(ranPattern){
	console.log('createGame: ' + ranPattern.width + 'x'+ ranPattern.height + ' ' + ranPattern.blockList);
	var offsetX = this.getOffsetCenter(ranPattern.width, SCREEN_WIDTH);
	var offsetY = this.getOffsetCenter(ranPattern.height, SCREEN_HEIGHT) - 240;
	this.createGameBoard(ranPattern.width, ranPattern.height, offsetX, offsetY);

    blockMgr.eraseBlocks();
    //var needBlock = (width * height) / blockMgr.BLOCK_VOLUME;
    //blockMgr.createRandomBlocks( needBlock+1 );
	blockMgr.createBlocks(ranPattern.blockListMap);
	this.currBlockList = ranPattern.blockList;	
	this.resetHint(ranPattern.hint);
}

CreateGameMgr.prototype.createRandomGame = function(){
	//var size = this.getRandomBoardSize();
	var ranPattern = 0;//patternData.getRandomPattern();
	this.createGame(ranPattern);
	this.isClear = false;
}

CreateGameMgr.prototype.CreateOfficialGame = function(ranPattern){
	this.createGame(ranPattern);
	this.isClear = false;
}

CreateGameMgr.prototype.InitGameBoardArray = function(width, height){
	this.gameBoard = new Array(height);
	for(var y = 0; y < height; ++y){
		this.gameBoard[y] = [];
		for(var x = 0; x < width; ++x){
			this.gameBoard[y].push(0);
		}
	}	
	this.clearGameBoardArray();
}

CreateGameMgr.prototype.clearGameBoardArray = function(){
	var lenY = this.gameBoard.length;
	for(var y = 0; y < lenY; ++y){
		var lenX = this.gameBoard[y].length;
		for(var x = 0; x < lenX; ++x){
			this.gameBoard[y][x] = false;
		}
	}
}

CreateGameMgr.prototype.fillGameBoardArray = function(blockList){
	this.clearGameBoardArray();
	var len = blockList.length;
	for(var i = 0; i < len; ++i){
		this.setGameBoardArray(blockList[i]);
	}
	//this.isClear = this.CheckFullGameBoardArray();
	if( this.CheckFullGameBoardArray() ){
		clientSocket.CheckFullGameBoardArrayReq(this.gameBoard);
	}
}

CreateGameMgr.prototype.CheckFullGameBoardArray = function(){
	var lenY = this.gameBoard.length;
	var lenX = this.gameBoard[0].length;
	for(var y = 0; y < lenY; ++y){
		var lenX = this.gameBoard[y].length;
		for(var x = 0; x < lenX; ++x){
			if(this.gameBoard[y][x] === false)
				return false;
		}
	}
	console.log('cleared by client ' + lenX + 'x' + lenY);
	return true;
}

CreateGameMgr.prototype.SetClearGame = function(){
	console.log('cleared by server');
	this.isClear = true;
}

CreateGameMgr.prototype.setGameBoardArray = function(block){
	var posList = blockMgr.getBlockPosList(block)
	for(var keyY in posList){
		var y = keyY - this.boardOffset.y;
		var lenY = this.gameBoard.length;
		if( y < 0 || y >= lenY )
			continue;
        for(var keyX in posList[keyY]){
        	var x = keyX - this.boardOffset.x;
        	var lenX = this.gameBoard[y].length;
        	if( x < 0 || x >= lenX )
        		continue;
        	this.gameBoard[y][x] = true;
        	//console.log('set:' + y + ' ' + x);
        }
    }
}

CreateGameMgr.prototype.setBoardOffset = function(offsetWidth, offsetHeight){
	this.boardOffset.x = offsetWidth / blockMgr.SIZE_ONE_BLOCK;
	this.boardOffset.y = offsetHeight / blockMgr.SIZE_ONE_BLOCK;
	//console.log(this.boardOffset);
}

CreateGameMgr.prototype.createGameBoard = function(spriteWidth, spriteHeight, offsetWidth, offsetHeight) {
	this.InitGameBoardArray(spriteWidth, spriteHeight);
	this.setBoardOffset(offsetWidth, offsetHeight);

    var gridName = 'drawingGrid';
    // draw play board
    game.create.grid(
    	gridName
    	, 20 * this.canvasZoom
    	, 6 * this.canvasZoom
    	, this.canvasZoom
    	, this.canvasZoom
    	, 'rgba(0,191,243,0.8)'
    	);

    if( typeof this.canvas !== 'undefined' )
    {
    	this.canvas.clear();
		this.canvasBG.clear();
		this.canvasGrid.kill();
    }

    this.canvas = game.make.bitmapData(spriteWidth * this.canvasZoom, spriteHeight * this.canvasZoom);
    this.canvasBG = game.make.bitmapData(this.canvas.width + 2, this.canvas.height + 2);

    this.canvasBG.rect(0, 0, this.canvasBG.width, this.canvasBG.height, '#fff');
    this.canvasBG.rect(1, 1, this.canvasBG.width - 2, this.canvasBG.height - 2, '#000000');

    //offset
    var x = offsetWidth - 1;
    var y = offsetHeight - 1;
    this.canvasBG.addToWorld(x, y);

    // checkline
    this.canvasGrid = game.add.sprite(x + 1, y + 1, gridName);
    this.canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * this.canvasZoom, spriteHeight * this.canvasZoom));
}

CreateGameMgr.prototype.resetHint = function(hint){
	this.hintList = hint;
	this.hintNum = 0;
	this.HideHint();
}

CreateGameMgr.prototype.AddHint = function(hintData){
	if( hintData.length == 0 )
		return;
	
	this.hintList.push(hintData);
	clientData.DecreaseHaveHint();
    this.ShowHint();
	this.UpdateHintText();
}

CreateGameMgr.prototype.ShowHint = function(){
	if(this.hintNum >= this.hintList.length)
	{
		if( clientData.GetHaveHint() <= 0 )
			return;
		
		clientSocket.SendGetHintReq(this.hintNum);
		return;
	}

	this.HideHint();
	for(var i in this.hintList[this.hintNum]){
		var pos = this.hintList[this.hintNum][i];
		var offsetX = (blockMgr.SIZE_ONE_BLOCK * this.boardOffset.x) + (pos.x * this.canvasZoom)+1;
		var offsetY = (blockMgr.SIZE_ONE_BLOCK * this.boardOffset.y) + (pos.y * this.canvasZoom)+1;
		var hintBlock = game.add.sprite(offsetX, offsetY, 'hintBlock');
		hintBlock.scale.set(3);
		this.hintSpriteList.push(hintBlock);
	}
	this.hintNum = (this.hintNum+1) % this.currBlockList.length;
}

CreateGameMgr.prototype.HideHint = function(){
	for(var i in this.hintSpriteList){
		this.hintSpriteList[i].kill();
	}
	this.hintSpriteList = [];
}