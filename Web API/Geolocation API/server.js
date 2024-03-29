// 一个简单的 Socket.IO 服务器
var http = require('http'),
	fs = require('fs'),
	express = require('express'),
	app = express();

var fileFormats = ['html', 'css'];

function isMatchFileFormat(format) {
	return fileFormats.indexOf(format) > -1 ? true : false;
}

app.get('/:filename.:format', function(req, res) {

	if (isMatchFileFormat(req.params.format)) {
		var filename = req.params.filename + '.' + req.params.format;
		res.sendfile(filename);
	} else {
		res.send('', 404);
	}

});
app.listen(80);

