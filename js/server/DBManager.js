
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
    })

    var userDBDataSchema = mongoose.Schema({
        _id: String, //loginKey
        loginType: Number,
        clearedData: [{ size: String, _id: String }]
    });

    UserDBData = mongoose.model('UserDBData', userDBDataSchema);
}

exports.FindUserData = function(userData_, findOnly_){
    console.log('find data type: ' + userData_.GetLoginType() + ' key: '+ userData_.GetKey());
    UserDBData.find({_id: userData_.GetKey()},function(err, data){
        if(err) return console.error(err);
        if( findOnly_ )
            return;
        userData_.onLoadDataResult(data);
    })    
}

exports.CreateNewUserData = function(userData_){
    console.log('create new data type: ' + userData_.GetLoginType() + ' key: '+ userData_.GetKey());
    var saveData = new UserDBData({ loginType: userData_.GetLoginType(), _id: userData_.GetKey() });
    saveData.save(function(err){
        if (err) console.log(err);
    });
    console.log(saveData);
}

exports.UpdateClaredGame = function(loginKey_, sizeStr, pattern){
    console.log('update data key: ' + loginKey_ + ' sizeStr: '+ sizeStr + ' pattern: ' + pattern);
    UserDBData.update(
        { _id: loginKey_ },
        { $push: { clearedData: { size: sizeStr, _id: pattern } } },
        function(err){
        if (err) console.log(err);
    });
}