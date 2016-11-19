
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 3000;

app.use(express.static(__dirname + '/../'));
app.get('/../', function(req, res){
  res.sendFile(__dirname + 'index.html');
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});

// 유저 접속 시 받는 패킷
io.on('connection', function(socket){	
	
	// 유저 접속 종료 시 처리
	socket.on('disconnect', function(){

	});

	
});
