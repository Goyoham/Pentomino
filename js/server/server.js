
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('../common/Utils.js');
require('../common/BlockMgr.js');
require('./PatternData.js');
_dbManager = require('./DBManager.js');
_userData = require('./UserData.js');
_serverSocket = require('./ServerSocket.js');
_webRequest = require('./WebRequest.js');

var port = 80;

app.use(express.static(__dirname + '/../../'));
app.get('/../../', function(req, res){
	res.sendFile(__dirname + 'index.html');
});

http.listen(port, function(){
	console.log('listening on *:'+port);
});

blockMgr.InitBlockForms();
_patternData.Init();
_dbManager.Init();

/*
1. 소켓 연결
2. 새 유저 데이터 생성
3. 로그인 체크 (Client)
4. 로그인 하면, 유저 데이터 생성 후 db에서 로드.
	4-1. 신규 유저면, 새 유저 데이터를 로그인 계정 데이터에 덮어쓰기 (db저장)
	4-2. 기존 유저면, 새 유저 데이터 삭제하고, 로그인 계정 데이터 사용
5. 로그아웃 하면, 기존 유제 데이터 초기화.
6. 소켓 연결 끊기면, socket 및 user data 제거
*/
io.on('connection', function(socket){	
	console.log('connected id: ' + socket.id); // 1. 소켓 연결
	_serverSocket.CreateUserSession(socket); // 2. 새 유저 데이터 생성
	_serverSocket.SendInit(socket);	// 3. 로그인 체크 (Client)
	_serverSocket.OnPacket(socket);	

    socket.on('disconnect', function(){ // 6. 소켓 연결 끊기면, socket 및 user data 제거
		console.log('disconnect id: ' + socket.id);
		_serverSocket.EraseSocket(socket.id);
	});	
});
