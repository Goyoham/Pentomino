
function CreateGameMgr(){

}

createGameMgr = new CreateGameMgr();

CreateGameMgr.prototype.canvasZoom = 20;
CreateGameMgr.prototype.gameBoard;
CreateGameMgr.prototype.boardOffset = {x: 0, y:0};
CreateGameMgr.prototype.isClear = false;
CreateGameMgr.prototype.hintBlockList = '';
CreateGameMgr.prototype.currBlockList = '';
CreateGameMgr.prototype.hintSpriteList = [];
CreateGameMgr.prototype.hintNum = -1;

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
CreateGameMgr.prototype.createGame = function(ranPattern){
	console.log('createGame: ' + ranPattern.width + 'x'+ ranPattern.height + ' ' + ranPattern.blockList);
	var offsetX = this.getOffsetCenter(ranPattern.width, SCREEN_WIDTH);
	var offsetY = this.getOffsetCenter(ranPattern.height, SCREEN_HEIGHT) - 80;
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
	var ranPattern = patternData.getRandomPattern();
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
	this.isClear = this.CheckFullGameBoardArray();
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
	console.log('CLEAR!!' + lenX + 'x' + lenY);
	return true;
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
	this.hintBlockList = hint;
	this.hintNum = -1;
	this.HideHint();
	textMessage.updateHintText(0);
}

CreateGameMgr.prototype.ShowHint = function(){
	//console.log('show hint : ' + this.hintBlockList);
	this.HideHint();
	var hintIndex = (++this.hintNum) % this.currBlockList.length;
	var hintBlockType = this.currBlockList[hintIndex];
	var arrBlock = this.hintBlockList.split('_');
	for(var y in arrBlock){
		for(var x in arrBlock[y]){
			if( arrBlock[y][x] !== hintBlockType )
				continue;
			
			var offsetX = (blockMgr.SIZE_ONE_BLOCK * this.boardOffset.x) + (x * this.canvasZoom)+1;
			var offsetY = (blockMgr.SIZE_ONE_BLOCK * this.boardOffset.y) + (y * this.canvasZoom)+1;
			var hintBlock = game.add.sprite(offsetX, offsetY, 'hintBlock');
			this.hintSpriteList.push(hintBlock);
		}
	}
	textMessage.updateHintText(this.hintNum+1);
	//setTimeout('createGameMgr.HideHint()', 3000);
}

CreateGameMgr.prototype.HideHint = function(){
	for(var i in this.hintSpriteList){
		this.hintSpriteList[i].kill();
	}
	this.hintSpriteList = [];
}