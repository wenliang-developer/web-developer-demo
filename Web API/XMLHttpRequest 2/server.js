// 一个简单的 Socket.IO 服务器
var http = require('http'),
	fs = require('fs'),
	express = require('express'),
	app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); 

app.use(bodyParser.text()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data
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
	var origin = req.get('origin');
	if(typeof req.body  === 'string'){
		var geoDataJson = JSON.parse(req.body);
		console.dir(geoDataJson);
	}
	res.writeHead(200,{
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods":"POST"
	});
	res.end('123');
});
app.listen(9999);