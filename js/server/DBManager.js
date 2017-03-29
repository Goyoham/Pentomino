
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
 
var UserDBData;
exports.db;
exports.Init = function(){
    mongoose.connect('mongodb://localhost/Pentomino888');
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'db connection error:'));
    this.db.once('open', function callback (){
        console.log("connected to db");
    });

    var userDBDataSchema = mongoose.Schema({
        _id: String, //loginKey
        loginType: Number,
        name: String,
        clearedData: [{ size: String, _id: String }],
        TotalClearedNum: {
            type: Number,
            index: true,
        },
        haveHint: Number,
        lastFilledHintDate: Date
    });

    UserDBData = mongoose.model('UserDBData', userDBDataSchema);

    this.FindUserRankingData();
}

exports.FindUserRankingData = function(){
    UserDBData.find(
        {},
        {
            name: true, 
            TotalClearedNum: true,
            loginType: true,
        },
        function(err, data){
        if(err) return console.error(err);
        console.log('findAll'+data);        
        _rankingManager.InitRanking(data);
    });
}

exports.FindUserData = function(userData_, findOnly_){
    console.log('find data type: ' + userData_.GetLoginType() + ' key: '+ userData_.GetKey());
    UserDBData.find(
        { 
            _id: userData_.GetKey() 
        }
        , function(err, data){
        if(err) return console.error(err);
        if( findOnly_ )
            return;
        userData_.onLoadDataResult(data);
    });
}

exports.CreateNewUserData = function(userData_){
    var userKey = userData_.GetKey();
    console.log('create new data type: ' + userData_.GetLoginType() + ' key: '+ userKey);
    var saveData = new UserDBData({ 
        loginType: userData_.GetLoginType()
        , _id: userKey
        , name: ''
        , TotalClearedNum: 0
        , haveHint: 100
        , lastFilledHintDate: new Date()
    });
    saveData.save(function(err){
        if (err) console.log(err);
    });
    console.log(saveData);
}

exports.UpdateUserInfo = function(userData_){
    var userKey = userData_.GetKey();
    console.log('update data key: ' + userKey + ' name: '+userData_.userInfo.name);
    UserDBData.update(
        { _id: userKey },
        { $set: { name: userData_.userInfo.name } },
        function(err){
        if (err) console.log(err);
    });
}

exports.UpdateClaredGame = function(userData_, sizeStr, pattern){
    var userKey = userData_.GetKey();
    var totalClreaedNum = userData_.GetTotalClearedNum();
    console.log('update data key: ' + userKey + ' sizeStr: '+ sizeStr + ' pattern: ' + pattern + ' totalClearedNum: ' + totalClreaedNum);
    UserDBData.update(
        { _id: userKey },
        { 
            $push: { clearedData: { size: sizeStr, _id: pattern } },
            $set: { TotalClearedNum: totalClreaedNum },
        },
        function(err){
        if (err) console.log(err);
    });
}

exports.DeleteClaredGame = function(userData_, pattern){
    var userKey = userData_.GetKey();
    console.log('delete pattern key: ' + userKey + ' pattern: ' + pattern);
    UserDBData.update(
        { _id: userKey },
        { 
            $pull: { clearedData: { _id: pattern } },
        },
        function(err){
        if (err) console.log(err);
    });
}

exports.UpdateTotalClearedNum = function(userData_){
    var userKey = userData_.GetKey();
    var totalClreaedNum = userData_.GetTotalClearedNum();
    console.log('update TotalClearedNum: ' + userKey + ' totalClearedNum: ' + totalClreaedNum);
    UserDBData.update(
        { _id: userKey },
        { 
            $set: { TotalClearedNum: totalClreaedNum },
        },
        function(err){
        if (err) console.log(err);
    });
}

exports.UpdateHaveHint = function(userData_, fillDailyHint){
    var userKey = userData_.GetKey();
    var haveHint = userData_.GetHaveHint();
    var query = { 
            $set: { 'haveHint': haveHint },
        };
    if( fillDailyHint === true ){
        query['$set']['lastFilledHintDate'] = new Date();
        console.log('update hint key: ' + userKey + ' haveHint: ' + haveHint + ' fillDailyHint: ' + fillDailyHint);
    }    
    UserDBData.update(
        { _id: userKey },
        query,
        function(err){
        if (err) console.log(err);
    });
}