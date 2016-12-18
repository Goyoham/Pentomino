
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
		
		console.log('board ' + num++ + ' size : ' + width + 'x' + height);
		this.verifyBoard(width, height);
		return;//test
	}
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

	while(boardState.type < blockMgr.BLOCK_CNT){
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
			if( boardState.state.rotation >= blockMgr.BLOCK_ROTATION ){
				boardState.state.rotation = 0;
				boardState.state.flip += 1; // 반전
			}
			if( boardState.state.flip >= blockMgr.BLOCK_FLIP ){
				boardState.state.flip = 0;
				boardState.type += 1; // 다음블럭
			}
			continue;
		}

		// check only
		if( this.insertBlock(boardState, form, true) ){
			// 블럭을 놓을 수 있을 때, 놓지 않고 다음으로 넘어가서 다른 경우의 수 계산.
			var cloneBoard = jQuery.extend(true, {}, boardState);
			cloneBoard.offsetX += 1;
			this.putBlocksOnBoard(cloneBoard); // make recursive

			// insert block
			this.insertBlock(boardState, form);
			boardState.type += 1;
			boardState.state.flip = 0;
			boardState.state.rotation = 0;
			boardState.offsetX = 0;
			boardState.offsetY = 0;
		}
		else{
			boardState.offsetX += 1;	
		}		
	}

	if( this.isCompletedBoard(boardState.board) )
		this.printBoard(boardState.board, 'case'+cn);
}

VerifyGame.prototype.insertBlock = function(boardState, form, bCheckOnly){
	var lenY = form.length;
	var lenX = form[0].length;
	for(var y = 0; y < lenY; ++y){
		for(var x = 0; x < lenX; ++x ){
			if( form[y][x] === 0 )
				continue;

			if( boardState.board[y+boardState.offsetY][x+boardState.offsetX] !== 0 )
				return false;
			
			if( bCheckOnly !== true )
				boardState.board[y+boardState.offsetY][x+boardState.offsetX] = boardState.state.type;				
		}
	}
	
	return true;
}

VerifyGame.prototype.isCompletedBoard = function(board){
	var lenY = board.length;
	var lenX = board[0].length;
	for(var y = 0; y < lenY; ++y){
		for(var x = 0; x < lenX; ++x ){
			if( board[y][x] === 0 )
				return false;
		}
	}
	return true;
}

VerifyGame.prototype.printBoard = function(board, msg){
	if( typeof msg !== 'undefined' )
		console.log(msg);
	var lenY = board.length;
	var lenX = board[0].length;
	for(var y = 0; y < lenY; ++y){
		var line = '';
		for(var x = 0; x < lenX; ++x){
			line += (board[y][x]+' ');
		}
		console.log(line);
	}
}