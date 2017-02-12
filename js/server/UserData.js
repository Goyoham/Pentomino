
exports.NextUserID = 1;
exports.UserDataList = {};
exports.GenerateUnknownUserID = function(){
    return this.NextUserID++;
}

exports.GetUserDataInstance = function(loginType, id_, socketID){
    var userData = new UserData();
    userData.socketID = socketID;

    if( loginType === LOGIN_TYPE.None )
        id_ = this.GenerateUnknownUserID();
    userData.SetID(id_, loginType);

    var key = userData.GetKey();
    this.UserDataList[key] = userData;
    console.log('GetUserDataInstance key: ' + key + ' (TotalNumOfUsers: ' + _utils.size(this.UserDataList)+')');
    return userData;
}

function UserData(){}

UserData.prototype.id = 0;
UserData.prototype.verifyingID = 0;
UserData.prototype.loginType = 0;
UserData.prototype.playingPattern = 0;
UserData.prototype.clearedPatterns = {};
UserData.prototype.socketID;

UserData.prototype.SetID = function(id_, loginType_){
    this.id = id_;
    this.loginType = loginType_;
    this.verifyingID = 0;
    console.log('setID: ' + this.id + ' t: ' + this.loginType + ' k:' +this.GetKey());
}

UserData.prototype.GetID = function(){
    return this.id;
}

UserData.prototype.SetVerifyingID = function(vid){
    this.verifyingID = vid;
}

UserData.prototype.GetVerifyingID = function(){
    return this.verifyingID;
}

UserData.prototype.GetKey = function(){
    return this.GetLoginType() +'_'+ this.GetID();
}

UserData.prototype.GetLoginType = function(){
    return this.loginType;
}

UserData.prototype.IsSaveAbleUser = function(){
    return this.loginType !== LOGIN_TYPE.None;
}

UserData.prototype.Logout = function(){
    // 5. 로그아웃 하면, 기존 유제 데이터 초기화.
    console.log('Logout User Key:'+this.GetKey());
    this.SetID(_userData.GenerateUnknownUserID(), LOGIN_TYPE.None );
    this.clearedPatterns = {}; // CLEAR
    _serverSocket.SendLoginClearedPattern(this.socketID, this.GetClearedNumOfPattern());
}

UserData.prototype.LoadGameDataFromDB = function(){
    _dbManager.FindUserData(this);
}

UserData.prototype.onLoadDataResult = function(dbData){
    console.log('Login User Key:'+this.GetKey() + ' dataLen:' + dbData.length);
    // 4-1. 신규 유저면, 새 유저 데이터를 로그인 계정 데이터에 덮어쓰기 (db저장)
    if( dbData.length === 0 ){
        _dbManager.CreateNewUserData(this);
        this.UpdateDB_UnknownUserClearedPatterns();
        _serverSocket.SendLoginClearedPattern(this.socketID, this.GetClearedNumOfPattern());
        return;
    }
    // 4-2. 기존 유저면, 새 유저 데이터 삭제하고, 로그인 계정 데이터 사용
    this.clearedPatterns = {}; // CLEAR
    var len = dbData[0].clearedData.length;
    console.log('load data length : ' + len);
    for(var i = 0; i < len; ++i){
        var data = dbData[0].clearedData[i];
        this.AddClearedPattern(data.size, data._id);
    }
    _serverSocket.SendLoginClearedPattern(this.socketID, this.GetClearedNumOfPattern());
}

UserData.prototype.UpdateDB_UnknownUserClearedPatterns = function(){
    for(var sizeStr in this.clearedPatterns){
        for(var i in this.clearedPatterns[sizeStr]){
            _dbManager.UpdateClaredGame(this.GetKey(), sizeStr, this.clearedPatterns[sizeStr][i]);
        }
    }
}

UserData.prototype.GetClearedNumOfPattern = function(){
    var clearedNumOfPattern = {};
    //console.log(this.clearedPatterns);
    for(var i in this.clearedPatterns){
        clearedNumOfPattern[i] = this.clearedPatterns[i].size;
    }
    console.log(clearedNumOfPattern);
    return clearedNumOfPattern;
}

UserData.prototype.SetPlayingPattern = function(pattern){
    this.playingPattern = pattern;
}

UserData.prototype.ClearPlayingPattern = function(){
    var sizeStr = this.playingPattern.width+'x'+this.playingPattern.height;
    var clearedData = {};
    clearedData.sizeStr = sizeStr;

    if( this.AddClearedPattern(sizeStr, this.playingPattern.hint) === false ){
        clearedData.clearedNum = this.clearedPatterns[sizeStr].size;
        console.log('duplicated clear ' + sizeStr + ' ' + this.playingPattern.hint);
        return clearedData;
    }
    clearedData.clearedNum = this.clearedPatterns[sizeStr].size;

    console.log('id:'+this.GetKey());
    if( this.IsSaveAbleUser() ){
        _dbManager.UpdateClaredGame(this.GetKey(), sizeStr, this.playingPattern.hint);
    }
    console.log('new clear ' + sizeStr + ' ' + clearedData.clearedNum + ' ' + this.playingPattern.hint + ' loginType: ' + this.GetLoginType());
    return clearedData;
}

UserData.prototype.AddClearedPattern = function(sizeStr, pattern){
    if( !this.clearedPatterns.hasOwnProperty(sizeStr) ){
        this.clearedPatterns[sizeStr] = new Set();
    }

    if( this.clearedPatterns[sizeStr].has(pattern) ){        
        return false;
    }

    this.clearedPatterns[sizeStr].add(pattern);
    //console.log('add '+ sizeStr + ' ' + pattern);
    return true;
}

UserData.prototype.IsAllClearedOfficialGame = function(sizeStr){
    if( !this.clearedPatterns.hasOwnProperty(sizeStr) )
        return false;
    var clearedNum = this.clearedPatterns[sizeStr].size;
    var numOfPattern = _patternData.GetNumOfPattern(sizeStr);
    return clearedNum >= numOfPattern;
}

UserData.prototype.GetOfficialPattern = function(sizeStr){
    var pattern = 0;
    do{
        pattern = _patternData.getPattern(sizeStr);
        if( this.IsAllClearedOfficialGame(sizeStr) )
            break;
        if( !this.clearedPatterns.hasOwnProperty(sizeStr) )
            break;
    } while( this.clearedPatterns[sizeStr].has(pattern.hint) );
    console.log('gameType : ' + sizeStr + ' key:' + pattern.blockList + ' ans:' + pattern.hint);
    return pattern;
}