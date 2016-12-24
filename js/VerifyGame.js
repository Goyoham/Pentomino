
function VerifyGame(){

}

verifyGame = new VerifyGame();

// 클리어 가능여부 검증. 모든 클리어 패턴 추출. 흰트로 활용.
// 맵사이즈별 모든 블럭 패턴 찾기
// 1.맵사이즈 / 2.블럭종류 / 3.블럭패턴

// 모든 경우의 수 계산 순서
/*
<검증순서>
1. 0,0 좌표에서 시작
2. 블럭이 보드 유효범위 안에 들어가는지 확인
3. 내 블럭을 기준으로 모든 방향 공간이 5의 배수로 남는지 확인.
(4. 가장 작은 공간부터 체우기)

<이동순서>
1. (0,0)을 시작으로 X좌표이동
2. Y좌표 이동.
3. roate 4회
4. flip
5. 다음 블럭

<완성 패턴 검증>
1. 완전 일치
2. 좌우 반전 일치
3. 상하 반전 일치
(맵은 가로가 세로보다 긴 것만 검증)
*/

VerifyGame.prototype.MIN_BREADTH = 3; // 최소 너비 또는 높이
VerifyGame.prototype.MAX_BREADTH = 20; // 최대 너비 또는 높이
VerifyGame.prototype.caseNum = 1;
VerifyGame.prototype.resultNum = 1;
VerifyGame.prototype.verifiedSerializedBoards = {};
VerifyGame.prototype.verifiedBoards = {};
VerifyGame.prototype.MAX_FIND_NUM = 10;

VerifyGame.prototype.verify = function(){
	// 1. 모든 맵 사이즈 루프
	var num = 1;
	var width = this.MIN_BREADTH;
	var height = this.MIN_BREADTH;
	for(; width <= this.MAX_BREADTH; ++height){
		if( height > width ){
			height = this.MIN_BREADTH;
			++width;
		}

		var volume = height * width;
		if( volume % blockMgr.BLOCK_VOLUME !== 0
			|| volume > blockMgr.BLOCK_VOLUME * blockMgr.BLOCK_CNT )
		{
			continue;
		}
		// test
		width = 9;
		height = 5;
		//test
		this.resultNum = 1;
		console.log('board ' + num++ + ' size : ' + width + 'x' + height);
		var old_time = new Date();
		this.verifyBoard(width, height);
		var new_time = new Date();
		var seconds_passed = (new_time - old_time) / 1000;
		console.log('elapsedTime : ' + seconds_passed);
		break;//test
	}

	console.log(this.verifiedBoards);
	this.writeVerifiedBoards();
	console.log('done');
}

VerifyGame.prototype.verifyBoard = function(width, height){
	// 2. 맵 생성
	var board = new Array(height);
	for(var y = 0; y < height; ++y){
		board[y] = new Array(width);
		for(var x = 0; x < width; ++x){
			board[y][x] = 0;
		}
	}

	var boardState = {};
	boardState.board = board;
	boardState.type = 0;//0~11(BLOCK_CNT)
	boardState.state = {};
	boardState.state.type = '';//alphabet
    boardState.state.flip = 0;//0~1
    boardState.state.rotation = 0;//0~3
    boardState.offsetX = 0;
    boardState.offsetY = 0;
    boardState.blockList = '';
	this.putBlocksOnBoard(boardState);
	// check board
}

/*
<이동순서>
1. (0,0)을 시작으로 X좌표이동
2. Y좌표 이동.
3. roate 4회
4. flip
5. 다음 블럭
*/
VerifyGame.prototype.putBlocksOnBoard = function(boardState){
	var cn = this.caseNum;
	this.caseNum = this.caseNum + 1 * 1;
	var boardSizeX = boardState.board[0].length;
    var boardSizeY = boardState.board.length;

    //var sizeTypeStr = this.getBoardSizeStr(boardState.board); // test break
	while(boardState.type < blockMgr.BLOCK_CNT){
		//if( this.verifiedBoards.hasOwnProperty(sizeTypeStr) )
		//	return; // test break

		boardState.state.type = blockMgr.blockName[boardState.type];
		var form = blockMgr.getBlockFormFromState(boardState.state);
		//console.log(state.type);
		var formSizeX = form[0].length;
		var formSizeY = form.length;
		if( formSizeX + boardState.offsetX > boardSizeX ){
			// x축 초과시 y축 이동
			boardState.offsetX = 0;
			boardState.offsetY += 1;
			continue;
		}
		else if( formSizeY + boardState.offsetY > boardSizeY ){
			// y축 초과시 블럭 모양 변경
			boardState.offsetX = 0;
			boardState.offsetY = 0;
			boardState.state.rotation += 1; // 회전
			if( boardState.state.rotation >= blockMgr.BLOCK_ROTATION )
			{
				boardState.state.rotation = 0;
				boardState.state.flip += 1; // 반전
			}

			if( boardState.state.flip >= blockMgr.BLOCK_FLIP 
				|| ( boardState.state.flip > 0 && blockMgr._isCannotFlip(boardState.state.type) ) )
			{
				boardState.state.flip = 0;
				boardState.type += 1; // 다음블럭
			}
			continue;
		}

		// check only
		if( this.insertBlock(boardState, form, true) ){
			// 블럭을 놓을 수 있을 때, 놓지 않고 다음으로 넘어가서 다른 경우의 수 계산.			
			var cloneBoardState = jQuery.extend(true, {}, boardState);
			cloneBoardState.offsetX += 1;
			this.putBlocksOnBoard(cloneBoardState); // make recursive
			
			// insert block
			this.insertBlock(boardState, form);

			if( false === this.checkImpossiblePlacement(boardState.board) )
				return;
			
			boardState.type += 1;
			boardState.state.flip = 0;
			boardState.state.rotation = 0;
			boardState.offsetX = 0;
			boardState.offsetY = 0;

			boardState.blockList += boardState.state.type;
		}
		else{
			boardState.offsetX += 1;	
		}		
	}

	if( this.isCompletedBoard(boardState.board) )
	{
		this.insertCompletedBoard(boardState);
		//this.printBoard(boardState.board, 'case'+cn);
	}
}

VerifyGame.prototype.insertBlock = function(boardState, form, bCheckOnly){
	for(var y in form){
		for(var x in form[y]){
			if( form[y][x] === 0 )
				continue;
			y*=1;x*=1; // 짱난다..
			if( boardState.board[y+boardState.offsetY][x+boardState.offsetX] !== 0 )
				return false;
			
			if( bCheckOnly !== true )
				boardState.board[y+boardState.offsetY][x+boardState.offsetX] = boardState.state.type;				
		}
	}
	
	return true;
}

var dirX = [1, 0, -1, 0];
var dirY = [0, 1, 0, -1];
var dir = 4;
VerifyGame.prototype.checkImpossiblePlacement = function(board){
	var cloneBoard = jQuery.extend(true, [], board);
	var lenX = cloneBoard[0].length;
	var lenY = cloneBoard.length;
	var space = 0;
	var _check = function(x, y){
		for(var d = 0; d < dir; ++d){
			var dx = 1*x + dirX[d];
			var dy = 1*y + dirY[d];
			if( dx < 0 || dy < 0 || dx >= lenX || dy >= lenY )
				continue;
			if( cloneBoard[dy][dx] !== 0 )
				continue;
			cloneBoard[dy][dx] = 1;
			space += 1;
			_check(dx, dy);
		}
	}

	for(var y in cloneBoard){
		for(var x in cloneBoard[y]){
			if(cloneBoard[y][x] !== 0)
				continue;
			space = 0;
			_check(x, y);
			if( space % blockMgr.BLOCK_VOLUME !== 0)
				return false;
		}
	}
	return true;
}

VerifyGame.prototype.isCompletedBoard = function(board){
	for(var y in board){
		for(var x in board[y]){
			if( board[y][x] === 0 )
				return false;
		}
	}
	return true;
}

VerifyGame.prototype.printBoard = function(board, msg){
	if( typeof msg !== 'undefined' )
		console.log(msg);
	for(var y in board){
		var line = '';
		for(var x in board[y]){
			line += (board[y][x]+' ');
		}
		console.log(line);
	}
}

VerifyGame.prototype.writeVerifiedBoards = function(){
	for(var sizeTypeStr in this.verifiedBoards){
		console.log('>>'+sizeTypeStr);
		for(var blocksStr in this.verifiedBoards[sizeTypeStr]){
			console.log('>'+blocksStr);
			for(var index in this.verifiedBoards[sizeTypeStr][blocksStr])
			{
				var board = this.verifiedBoards[sizeTypeStr][blocksStr][index];
				console.log(this.serializeBoardSingle(board));
			}			
		}
	}
}

VerifyGame.prototype.insertCompletedBoard = function(boardState){
	var board = boardState.board;
	var serializedBoards = this.serializeBoard(board);
	var sizeTypeStr = this.getBoardSizeStr(board);
	if( !this.verifiedSerializedBoards.hasOwnProperty(sizeTypeStr) ){
		this.verifiedSerializedBoards[sizeTypeStr] = new Set();
	}

	if( this.verifiedSerializedBoards[sizeTypeStr].has(serializedBoards[0]) )
		return;

	for(var i in serializedBoards){
		this.verifiedSerializedBoards[sizeTypeStr].add(serializedBoards[i]);
	}

	if( !this.verifiedBoards.hasOwnProperty(sizeTypeStr) ){
		this.verifiedBoards[sizeTypeStr] = {};
	}

	var blockList = boardState.blockList;
	if( !this.verifiedBoards[sizeTypeStr].hasOwnProperty(blockList) ){
		this.verifiedBoards[sizeTypeStr][blockList] = [];
	}

	this.verifiedBoards[sizeTypeStr][blockList].push(board);
	//log
	//this.printBoard(board, '<Result ' + this.resultNum++ + '> ' + boardState.blockList);
	console.log('<Result ' + this.resultNum++ + '> ' + boardState.blockList);
}

VerifyGame.prototype.getBoardSizeStr = function(board){
	var height = board.length;
	var width = board[0].length;	
	return width+'x'+height;
}

VerifyGame.prototype.serializeBoard = function(board){	
	var height = board.length;
	var width = board[0].length;
	var serializedBoards = ['', '', '', ''];
	for(var y in board){
		for(var x in board[y]){
			serializedBoards[0] += board[y][x];
			serializedBoards[1] += board[y][width-x-1];
			serializedBoards[2] += board[height-y-1][x];
			serializedBoards[3] += board[height-y-1][width-x-1];
		}
	}
	//console.log(serializedBoards);
	return serializedBoards;
}

VerifyGame.prototype.serializeBoardSingle = function(board){
	var serializedBoard = '';
	for(var y in board){
		for(var x in board[y]){
			serializedBoard += board[y][x];
		}
	}	
	return serializedBoard;
}

VerifyGame.prototype.deserializeBoard = function(serializedBoard){
	
}