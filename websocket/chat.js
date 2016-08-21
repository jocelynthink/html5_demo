var http = require('http');
var url = require('url');
var fs = require('fs');

//http://localhost:6666/index.html?a=1

var wwwpath = __dirname + '/www';

var server = http.createServer(function(req, res) {
	console.log('有请求了');
	
	console.log(req.url);
	
	console.log(__dirname);
	
	console.log(url.parse(req.url));
	
	var filename = url.parse(req.url).pathname;
	
	//console.log( wwwpath + filename );
	
	fs.readFile(wwwpath + filename, function(err, data) {
		if (err) {
			console.log('请求有错误了');
			res.setHeader('content-type','text/html;charset="utf-8"');
			res.end('<h1>404,页面未找到<h1>');
		} else {
			res.setHeader('content-type','text/html;charset="utf-8"');
			res.end(data);
		}
	});
	
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
	console.log('有socket连接了');
	
	//console.log(socket);
	
	socket.emit('welcome', {
		id : socket.id
	});
	
	socket.broadcast.emit('welcomeAll', {
		id : socket.id
	});
	
	socket.on('send', function(data) {
		//把数据处理一下返回给当前发送消息的客户端
		var responseData = {
			id : socket.id,
			content : data.content
		};
		socket.emit('response', responseData);
		//把数据发送给其他的客户端
		socket.broadcast.emit('response', responseData);
	});
	
	socket.on('disconnect', function() {
		console.log('有人退出了');
		
		socket.broadcast.emit('quitAll', {
			id : socket.id
		});
	});
	
});

server.listen(5000);