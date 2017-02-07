
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
function DBManager(){}
_dbManager = new DBManager();

DBManager.prototype.Init = function(){
    mongoose.connect('mongodb://localhost/test');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'db connection error:'));
    db.once('open', function callback (){
        console.log("connected to db");
    })

    var userDBDataSchema = mongoose.Schema({
        loginType: Number,
        loginKey: String,
        clearedData: { sizeStr: String, list: [String]}
    });

    var UserDBData = mongoose.model('UserDBData', userDBDataSchema);

    var oneData = new UserDBData({loginType: 99});
    console.log(oneData);
    // oneData.save(function(err){
    //     if (err) console.log(err);
    // });

    UserDBData.find({loginType: 99},function(err, data){
        if(err) return console.error(err);
        console.log(data);
    })
}

DBManager.prototype.LoginFromFacebook = function(response){

}