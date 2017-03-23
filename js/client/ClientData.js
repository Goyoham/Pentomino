
function ClientData(){}
var clientData = new ClientData;

ClientData.prototype.NumOfPattern = {};
ClientData.prototype.ClearedNumOfPattern = {};
ClientData.prototype.TotalNumOfPattern = 0;
ClientData.prototype.MyRanking = 0;
ClientData.prototype.haveHint = 0;

ClientData.prototype.InitData = function(data){
    this.NumOfPattern = data.NumOfPattern;
    this.TotalNumOfPattern = data.TotalNumOfPattern;

    for(var i in this.NumOfPattern){
        //console.log(i + ' ' + this.NumOfPattern[i]);
        this.ClearedNumOfPattern[i] = 0;
    }
    //console.log('TotalNumOfPattern : ' + this.TotalNumOfPattern);
}

ClientData.prototype.InitClearedData = function(data){
    this.ClearedNumOfPattern = {};
    for(var i in data.clearedNumOfPattern){
        this.SetClearedNumOfPattern(i, data.clearedNumOfPattern[i]);
    }
}

ClientData.prototype.SetMyRanking = function(myRanking_){
    this.MyRanking = myRanking_;
    if( _gameState.GetState() == state.MainPage )
        _gameState.SetState(state.MainPage);
}

ClientData.prototype.SetHaveHint = function(haveHint){
    this.haveHint = haveHint;
    //console.log('setHaveHint:'+this.haveHint);
}

ClientData.prototype.GetHaveHint = function(){
    return this.haveHint;
}

ClientData.prototype.DecreaseHaveHint = function(){
    if( this.haveHint <= 0 )
        return;
    --this.haveHint;
}

ClientData.prototype.GetNumOfPattern = function(size){
    if( typeof size === 'undefined' || size === 0 ){
        return this.TotalNumOfPattern;
    }

    if( this.NumOfPattern.hasOwnProperty(size) ){
        return this.NumOfPattern[size];
    }

    return 0;
}

ClientData.prototype.SetClearedNumOfPattern = function(size, num){
    this.ClearedNumOfPattern[size] = num;
    //console.log('set clearedNum ' + size + ' ' + num);
}

ClientData.prototype.GetClearedNumOfPattern = function(size){
    if( typeof(size) === 'undefined' || size === 0 ){
        var sum = 0;
        for(var i in this.ClearedNumOfPattern)
            sum += this.ClearedNumOfPattern[i];
        return sum;
    }

    if( this.ClearedNumOfPattern.hasOwnProperty(size) ){
        return this.ClearedNumOfPattern[size];
    }

    return 0;
}

ClientData.prototype.GetMyClearDataStr = function(size, withPercent){
    var clearData = clientData.GetClearedNumOfPattern(size) + ' / ';
    clearData += clientData.GetNumOfPattern(size);
    if( withPercent )
        clearData += this.GetPercentMyClearDataStr(size);
    return clearData;
}

ClientData.prototype.IsAllCleared = function(size){
    return clientData.GetClearedNumOfPattern(size) >= clientData.GetNumOfPattern(size);
}

ClientData.prototype.GetPercentMyClearDataStr = function(size){
    var clearedNum = clientData.GetClearedNumOfPattern(size);
    return this.GetPercentStr(clearedNum, size);
}

ClientData.prototype.GetPercentStr = function(clearedNum, size){
    var totalNum = clientData.GetNumOfPattern(size);
    if( totalNum === 0 )
        return 'err/0';
    var fixedStr = 0;
    if( totalNum > 1000 ){
        fixedStr = 2;
    }else if( totalNum > 100 ){
        fixedStr = 1;
    }
    return ' (' +(clearedNum / totalNum * 100).toFixed(fixedStr) + '%)';
}