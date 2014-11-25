// 一个简单的 Socket.IO 服务器
var http = require('http'),
	fs = require('fs'),
	express = require('express'),
	app = express();

var fileFormats = ['html','ico','css'];
function isMatchFileFormat(format){
	return fileFormats.indexOf(format) > -1 ? true : false;
}

app.get('/:filename.:format', function(req, res) {
	var filename = req.params.filename + '.' + req.params.format;
	if(isMatchFileFormat(req.params.format)){
		res.sendfile(filename);
	} else {
		res.send('', 200);
	}
});

app.all('/upload/server.js',function(req, res){
	res.writeHead(200,{
		"Access-Control-Allow-Origin":"http://portal.example.com:9999",
		"Access-Control-Allow-Methods":"POST"
	});
	res.end('123');
});
app.listen(9999);