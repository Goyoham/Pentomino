
function ServerSocket(){}

ServerSocket.prototype.socket;
ServerSocket.prototype.userData;
CreateUserSessionInstnace = function(socket){
    var session = new ServerSocket();
    session.socket = socket;
    session.userData = GetUserDataInstance(socket);
    return session;
}

ServerSocket.prototype.SendInit = function(){
    var data = {};
    data.TotalNumOfPattern = _patternData.TotalNumOfPattern;
    data.NumOfPattern = _patternData.NumOfPattern;
    this.socket.emit('connected', data);
}

ServerSocket.prototype.OnPacket = function(){
    var socket = this.socket;
    var userData = this.userData;
    this.socket.on('get_game_pattern_req', function(data){
		var ack = {};
        ack.ranPattern = userData.GetOfficialPattern(data.gameType);
        userData.SetPlayingPattern(ack.ranPattern);
        socket.emit('get_game_pattern_ack', ack);
	});	

    this.socket.on('verify_cleared_game_req', function(data){
        var ack = {};
        ack.isClear = true;
        if( ack.isClear ){
            ack.clearedData = userData.ClearPlayingPattern();
        }
        socket.emit('verify_cleared_game_ack', ack);
	});	

    this.socket.on('disconnect', function(){
		console.log('disconnect');
	});	
}
