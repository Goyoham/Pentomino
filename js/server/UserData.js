
var NextUserID = 1;
function UserData(){}

UserData.prototype.id = 0;
UserData.prototype.playingPattern = {};
UserData.prototype.clearedPatterns = {};

GetUserDataInstance = function(socket){
    var data = new UserData();
    data.SetID(NextUserID++);
    return data;
}

UserData.prototype.SetID = function(id_){
    this.id = id_;
}
UserData.prototype.GetID = function(){
    return this.id;
}

UserData.prototype.SetPlayingPattern = function(pattern){
    this.playingPattern = pattern;
}

UserData.prototype.ClearPlayingPattern = function(){
    var clearedData = {};
    var sizeStr = this.playingPattern.width+'x'+this.playingPattern.height;
    if( !this.clearedPatterns.hasOwnProperty(sizeStr) ){
        this.clearedPatterns[sizeStr] = new Set();
    }

    clearedData.sizeStr = sizeStr;
    clearedData.clearedNum = this.clearedPatterns[sizeStr].size;

    if( this.clearedPatterns[sizeStr].has(this.playingPattern.hint) ){
        console.log('duplicated clear ' + sizeStr + ' ' + this.playingPattern.hint);
        return clearedData;
    }

    this.clearedPatterns[sizeStr].add(this.playingPattern.hint);
    clearedData.clearedNum = this.clearedPatterns[sizeStr].size;
    console.log('new clear ' + sizeStr + ' ' + clearedData.clearedNum + ' ' + this.playingPattern.hint);
    return clearedData;
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