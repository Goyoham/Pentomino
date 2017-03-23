
function ClientSocket(){}
clientSocket = new ClientSocket();

var socket = io();
socket.on('connected', function(data){
    //console.log('connected to server');
    clientData.InitData(data);
    checkLoginState();
});

socket.on('login_cleared_pattern_not', function(data){
    //console.log('got login data');
    clientData.InitClearedData(data);
    if( mainPage.ready ){
        // mainPage.ShowMainPage();
        _gameState.SetState(state.MainPage);
    }
});

ClientSocket.prototype.CreateOfficialGameReq = function(gameType){
    var data = {};
    data.gameType = gameType;
    socket.emit('get_game_pattern_req', data);
}
socket.on('get_game_pattern_ack', function(data){
    //console.log(data.ranPattern);
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
    //console.log(data);
    clientData.SetClearedNumOfPattern(data.clearedData.sizeStr, data.clearedData.clearedNum);
    createGameMgr.SetClearGame();
});

ClientSocket.prototype.ReverifyLogin_Facebook = function(data){
    socket.emit('reverify_login_from_facebook_req', data);
}
socket.on('reverify_login_from_facebook_ack', function(data){
    //console.log(data);
});

ClientSocket.prototype.SendLoginedUserInfoNot = function(data){
    socket.emit('logined_user_info_not', data);
}

ClientSocket.prototype.LoginOut_Facebook = function(){
    socket.emit('loginout_from_facebook_req', {});
}
socket.on('loginout_from_facebook_ack', function(data){
    //console.log(data);
});

socket.on('my_ranking_not', function(data){
    //console.log(data);
    clientData.SetMyRanking( data.myRanking );
});

socket.on('update_have_hint_not', function(data){
    //console.log(data);
    clientData.SetHaveHint( data.haveHint );
});

ClientSocket.prototype.SendRankingListByPageReq = function(page_){
    var data = {};
    data.page = page_;
    socket.emit('get_ranking_list_by_page_req', data);
}
socket.on('get_ranking_list_by_page_ack', function(data){
    rankingPage.ShowRankingList(data);
});

ClientSocket.prototype.SendGetHintReq = function(hintNum){
    var data = {};
    data.hintNum = hintNum;
    socket.emit('get_hint_req', data);
}
socket.on('get_hint_ack', function(data){
    createGameMgr.AddHint(data.hintData);
});