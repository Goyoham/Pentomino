
function ClientData(){}
var clientData = new ClientData;

ClientData.prototype.NumOfPattern = {};
ClientData.prototype.ClearedNumOfPattern = {};
ClientData.prototype.TotalNumOfPattern = 0;

ClientData.prototype.InitData = function(data){
    this.NumOfPattern = data.NumOfPattern;
    this.TotalNumOfPattern = data.TotalNumOfPattern;

    for(var i in this.NumOfPattern){
        console.log(i + ' ' + this.NumOfPattern[i]);
        this.ClearedNumOfPattern[i] = 0;
    }
    console.log('TotalNumOfPattern : ' + this.TotalNumOfPattern);

}

ClientData.prototype.GetNumOfPattern = function(size){
    if( typeof(size) === 'undefined' || size === 0 ){
        return this.TotalNumOfPattern;
    }

    if( this.NumOfPattern.hasOwnProperty(size) ){
        return this.NumOfPattern[size];
    }

    return 0;
}

ClientData.prototype.SetClearedNumOfPattern = function(size, num){
    this.ClearedNumOfPattern[size] = num;
    console.log('set clearedNum ' + size + ' ' + num);
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

ClientData.prototype.GetPercentMyClearDataStr = function(size){
    var clearedNum = clientData.GetClearedNumOfPattern(size);
    var totalNum = clientData.GetNumOfPattern(size);
    if( totalNum === 0 )
        return 'err/0';
    return ' (' +(clearedNum / totalNum * 100).toFixed(2) + '%)';
}