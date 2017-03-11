
exports.rankingOrderList = [];
exports.rankingUserList = {};
exports.lastRankingSortedDate = new Date();
USER_PER_PAGE = 10;

exports.InitRanking = function(dbData){
    console.log('initRanking');
    if( dbData.length === 0 ){
        return;
    }
    var len = dbData.length;
    for(var i = 0; i < len; ++i){
        this.rankingOrderList.push(dbData[i]);
    }
    this.SortRanking(true);
}

exports.CanSortRanking = function(){
    var nowDate = new Date();
    nowDate.setMinutes(nowDate.getMinutes() - 2);
    return this.lastRankingSortedDate.getTime() < nowDate.getTime();
}

exports.SortRanking = function(force_){
    if( !force_ && !this.CanSortRanking() )
        return;

    this.rankingOrderList.sort(function(a, b){
        return a.TotalClearedNum < b.TotalClearedNum;
    });

    console.log('*orderList '+this.rankingOrderList);
    this.rankingUserList = {};
    for(var index in this.rankingOrderList){
        var data = this.rankingOrderList[index];
        data.ranking = 1*index+1;
        this.rankingUserList[data._id] = data;
    }

    this.lastRankingSortedDate = new Date();
}

exports.GetUserRanking = function(userID_){
    if( !this.rankingUserList.hasOwnProperty(userID_) )
        return 0;    
    return this.rankingUserList[userID_].ranking;
}

exports.GetRankingListByPage = function(page_){
    var startIndex = page_ <= 1 ? 0 : (page_ - 1) * USER_PER_PAGE;
    var endIndex = startIndex + USER_PER_PAGE;
    var len = this.rankingOrderList.length;
    var rankingList = [];
    for(var i = startIndex; i < endIndex; ++i){
        if( i >= len )
            break;
        var data = this.rankingOrderList[i];
        var clientData = {};
        clientData.name = data.name;
        clientData.ranking = data.ranking;
        clientData.TotalClearedNum = data.TotalClearedNum;
        rankingList.push(clientData);
    }
    return rankingList;
}

exports.GetRankingOrderIndex = function(data_){
    var index = data_.ranking-1;
    if( index < 0 
        || index >= this.rankingOrderList.length
        || data_._id !== this.rankingOrderList[index]._id )
    {
        return -1;
    }
    return index;
}

exports.InsertNewUser = function(userData_){
    if( this.GetUserRanking(userData.GetKey()) > 0 )
        return;
    var data = {};
    data._id = userData_.GetKey();
    data.name = userData_.GetName();
    data.TotalClearedNum = userData_.GetTotalClearedNum();
    this.rankingOrderList.push(data);
    data.ranking = this.rankingOrderList.length;
    this.rankingUserList[data._id] = data;
}

exports.UpdateUserRecord = function(userData_){
    var userID = userData_.GetKey();
    if( this.GetUserRanking(userID) === 0 )
    {
        this.InsertNewUser(userData_);
        return;
    }
    
    data = this.rankingUserList[userID];
    if( userData_.GetName() !== 'unknown')
        data.name = userData_.GetName();
    data.TotalClearedNum = userData_.GetTotalClearedNum();
    var index = this.GetRankingOrderIndex(data);
    if( index >= 0 ){
        this.rankingOrderList[index] = data;
    }
    this.SortRanking(false);
}