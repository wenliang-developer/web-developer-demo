// 一个简单的 Socket.IO 服务器
var http = require('http'),
	fs = require('fs'),
	express = require('express'),
	app = express();

var fileFormats = ['html','ico','css','js'];
function isMatchFileFormat(format){
	return fileFormats.indexOf(format) > -1 ? true : false;
}

app.get('/:filename.:format', function(req, res) {
var filename = req.params.filename + '.' + req.params.format;
		console.dir(req.get('Origin'))
		res.set("Access-Control-Allow-Origin", "http://portal.example.com:9999")
        //res.set("Access-Control-Allow-Methods", "POST")
	if(isMatchFileFormat(req.params.format)){
	
		
		res.sendfile(filename);
	} else {
	 	res.send('', 200);
	}
	
});
app.listen(9999);