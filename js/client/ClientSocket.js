
function ClientSocket(){}
clientSocket = new ClientSocket();

var socket = io();
socket.on('connected', function(data){
    console.log('connected to server');
    clientData.InitData(data);
});

ClientSocket.prototype.CreateOfficialGameReq = function(gameType){
    var data = {};
    data.gameType = gameType;
    socket.emit('get_game_pattern_req', data);
}
socket.on('get_game_pattern_ack', function(data){
    console.log(data.ranPattern);
    createGameMgr.CreateOfficialGame(data.ranPattern);
});

ClientSocket.prototype.CheckFullGameBoardArrayReq = function(gameBoard){
	var data = {};
    data.gameBoard = gameBoard;
    socket.emit('verify_cleared_game_req', data);
}
socket.on('verify_cleared_game_ack', function(data){
    if( !data.isClear )
        return;
    console.log(data);
    createGameMgr.SetClearGame();
    clientData.SetClearedNumOfPattern(data.clearedData.sizeStr, data.clearedData.clearedNum);
});