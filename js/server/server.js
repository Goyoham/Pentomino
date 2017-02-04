
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('../common/BlockMgr.js');
require('./PatternData.js');
require('./ServerSocket.js');
require('./UserData.js');

var port = 3001;

app.use(express.static(__dirname + '/../../'));
app.get('/../../', function(req, res){
	res.sendFile(__dirname + 'index.html');
});

http.listen(port, function(){
	console.log('listening on *:'+port);
});

blockMgr.InitBlockForms();
_patternData.Init();

//io.emit('init', initData);
io.on('connection', function(socket){	
	console.log('connected');
	var userSession = CreateUserSessionInstnace(socket);
	console.log('id:'+userSession.userData.GetID());

	userSession.SendInit();	
	userSession.OnPacket();
});
