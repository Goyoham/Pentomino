
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
    
    var _ReverifyLoginCallback_Facebook = this.ReverifyLoginCallback_Facebook;
    this.socket.on('reverify_login_from_facebook_req', function(data){        
        var options = {
            host: 'graph.facebook.com',
            port: 443,
            path: '/debug_token?input_token='+data.authResponse.accessToken+'&access_token=1780322648960716|ed92ed7c67d4e91992b7911c3f356c57',
            //path: '/oauth/access_token?client_id=1780322648960716&client_secret=ed92ed7c67d4e91992b7911c3f356c57&grant_type=client_credentials',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        _webRequest.getJSON(options, _ReverifyLoginCallback_Facebook, socket);
    });

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

ServerSocket.prototype.ReverifyLoginCallback_Facebook = function(result, socket){
    var ack = {};
    console.log(result);
    ack.result = result;
    socket.emit('reverify_login_from_facebook_ack', ack);
}