
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

VerifyGame.prototype.verify = function(){
	// 1. 맵 사이즈 정의
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
		
		this.verifyBoard(width, height);
	}
}

VerifyGame.prototype.verifyBoard = function(width, height){
	// 2. 맵 생성
	var board = new Array(height);
	for(var y = 0; y < height; ++y){
		board[y] = new Array(width);
		for(var x = 0; x < width; ++x){
			board[y][x] = -1;
		}
	}

	
}