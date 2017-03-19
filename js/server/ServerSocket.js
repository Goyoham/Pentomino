
exports.CreateUserSession = function(socket){
    //var session = new ServerSocket();
    //session.socket = socket;
    //session.SetUserData(LOGIN_TYPE.None, 0, session);
    //return session;
    var userData = _userData.GetUserDataInstance(LOGIN_TYPE.None, 0, socket.id);
    this.InsertSocket(socket, userData);
}

exports.SocketList = {};
exports.InsertSocket = function(socket, userData){
    console.log('InsertSocket id: ' + socket.id);
    this.SocketList[socket.id] = {};
    this.SocketList[socket.id].socket = socket;
    this.SocketList[socket.id].userData = userData;
}
exports.EraseSocket = function(socketID){
    if( !this.SocketList.hasOwnProperty(socketID) ){
        console.log('1 cannot find socket id:' + socketID);
        return;
    }
    delete this.SocketList[socketID];
    // test
    if( this.SocketList.hasOwnProperty(socketID) ){
        console.log('failed to delete socket id:' + socketID);
    }
}
exports.ChangeUserDataBySocket = function(socketID, userData){
    if( !this.SocketList.hasOwnProperty(socketID) ){
        console.log('2 cannot find socket id:' + socketID);
        return;
    }
    this.SocketList[socketID].userData = userData;
}
exports.GetSocket = function(socketID){
    if( !this.SocketList.hasOwnProperty(socketID) ){
        console.log('3 cannot find socket id:' + socketID);
        return;
    }
    return this.SocketList[socketID].socket;
}
exports.GetUserData = function(socketID){
    if( !this.SocketList.hasOwnProperty(socketID) ){
        console.log('4 cannot find socket id:' + socketID);
        return;
    }
    return this.SocketList[socketID].userData;
}

exports.SendInit = function(socket){
    var data = {};
    data.TotalNumOfPattern = _patternData.TotalNumOfPattern;
    data.NumOfPattern = _patternData.NumOfPattern;
    socket.emit('connected', data);
}

exports.OnPacket = function(socket){    
    socket.on('reverify_login_from_facebook_req', function(data){
        var userData = _serverSocket.GetUserData(socket.id);
        userData.SetVerifyingID(data.authResponse.userID);
        console.log('login req vid: ' + userData.GetVerifyingID());
        console.log('name:'+data.name);
        var options = {
            host: 'graph.facebook.com',
            port: 443,
            path: '/debug_token?input_token='+data.authResponse.accessToken+'&access_token='+APP.ID+'|'+APP.SECRET,
            //path: '/oauth/access_token?client_id=1780322648960716&client_secret=ed92ed7c67d4e91992b7911c3f356c57&grant_type=client_credentials',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        _webRequest.getJSON(options, _serverSocket.ReverifyLoginCallback_Facebook, socket);
    });

    socket.on('logined_user_info_not', function(data){
        console.log('*loginedName: '+data.name);
        var userData = _serverSocket.GetUserData(socket.id);
        userData.SetUserInfo(data);
	});

    socket.on('loginout_from_facebook_req', function(data){
        var userData = _serverSocket.GetUserData(socket.id);
        if( typeof userData === 'undefined')
            return;
        console.log('on packet logout');
		var ack = {};
        userData.Logout();
        socket.emit('loginout_from_facebook_ack', ack);
	});

    socket.on('get_game_pattern_req', function(data){
        var userData = _serverSocket.GetUserData(socket.id);
        if( typeof userData === 'undefined')
            return;
		var ack = {};
        ack.ranPattern = userData.GetOfficialPattern(data.gameType);
        socket.emit('get_game_pattern_ack', ack);
	});

    socket.on('verify_cleared_game_req', function(data){
        var userData = _serverSocket.GetUserData(socket.id);
        if( typeof userData === 'undefined')
            return;
        var ack = {};
        ack.isClear = true;
        if( ack.isClear ){
            console.log('clear user key: ' + userData.GetKey());
            ack.clearedData = userData.ClearPlayingPattern();
        }
        socket.emit('verify_cleared_game_ack', ack);
	});

    socket.on('get_ranking_list_by_page_req', function(data){
        var userData = _serverSocket.GetUserData(socket.id);
        if( typeof userData === 'undefined')
            return;
        
        var ack = {};
        ack.rankingList = _rankingManager.GetRankingListByPage(data.page);
        socket.emit('get_ranking_list_by_page_ack', ack);
	});

    socket.on('get_hint_req', function(data){
        var userData = _serverSocket.GetUserData(socket.id);
        if( typeof userData === 'undefined')
            return;
        
        var ack = {};
        ack.hintData = userData.GetHint(data.hintNum);
        socket.emit('get_hint_ack', ack);
	});
}

exports.ReverifyLoginCallback_Facebook = function(result, socket){
    var ack = {};
    console.log(result);
    var id = result.data.user_id;
    var userData = _serverSocket.GetUserData(socket.id);
    if( typeof userData === 'undefined')
            return;
    ack.ok = userData.GetVerifyingID() === id ? 1 : 0
    ack.result = result; // should delete
    socket.emit('reverify_login_from_facebook_ack', ack);
    if( ack.ok === 1 ){ // 4. 로그인 하면, 유저 데이터 생성 후 db에서 로드.
        console.log('succeed to reverify login from facebook : ' + userData.GetVerifyingID() + ' ' + id);
        userData.SetID(id, LOGIN_TYPE.Facebook); // 로그인한 ID로 갱신
        userData.LoadGameDataFromDB();
    }
    else{
        console.log('failed to reverify login from facebook : ' + userData.GetVerifyingID() + ' ' + id);
    }
}

exports.SendLoginClearedPattern = function(userData_){
    var socket = this.GetSocket(userData_.socketID);
    var data = {};
    data.clearedNumOfPattern = userData_.GetClearedNumOfPattern();
    console.log('SendLoginClearedPattern size:' + _utils.size(data.clearedNumOfPattern));
    socket.emit('login_cleared_pattern_not', data);

    _rankingManager.UpdateUserRecord(userData_);
    this.SendMyRanking(userData_);
    this.UpdateHaveHint(userData_);
}

exports.SendMyRanking = function(userData_){
    var socket = this.GetSocket(userData_.socketID);
    var data = {};
    data.myRanking = _rankingManager.GetUserRanking(userData_.GetKey());
    if( userData_.myRanking === data.myRanking )
        return;
    userData_.myRanking = data.myRanking;
    socket.emit('my_ranking_not', data);
}

exports.UpdateHaveHint = function(userData_){
    var socket = this.GetSocket(userData_.socketID);
    var data = {};
    data.haveHint = userData_.GetHaveHint();
    socket.emit('update_have_hint_not', data);
}