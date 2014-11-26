var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    crypto = require('crypto');

var fileFormats = ['html', 'css'], //允许访问的文件格式
    clientList = []; //客户端 socket

//文件格式校验
function isMatchFileFormat(format) {
    return fileFormats.indexOf(format) > -1 ? true : false;
}

var port = 9999;
var server = http.createServer();

server.listen(port, function() {
    console.log('server is running on localhost:', port);
});

server.on('request', function(req, res) {
    if (!req.upgrade) {
        // 非upgrade请求选择：中断或提供普通网页
        var format = req.url.split('.')[1];
        var data = '123';
        if (isMatchFileFormat(format)) {
            data = fs.readFileSync(__dirname + req.url);
        }
        res.end(data);
    }
    res.end();
    return;
});

// TCP 连接
server.on('connection', function(socket) {
    console.log('on connection ');
});

// 升级协议
server.on('upgrade', function(req, socket, head) {
    console.log('on upgrade');
    if (req.headers.upgrade !== 'websocket') {
        console.warn('非法连接: 不是 websocket');
        socket.end();
        return;
    }

    // echo 为客户套接字 ， broadcast 为客户端广播套接字
    if (req.url === '/echo') {
        bindClientSocketEvent(socket, 'client');
    } else if (req.url === '/broadcast') {
        bindClientSocketEvent(socket, 'broadcast');
    } else {
        console.warn('非法链接 path: ' + req.url);
    }

    handshake(req, socket, head);

});

// 为 Web socket 绑定事件
function bindClientSocketEvent(socket, socketType) {
    socket.name = socket.remoteAddress + ':' + socket.remotePort;

    if (socketType === 'client') {
        clientList.push(socket);
    }

    socket
        .on('data', function(buffer) {
            var clientString = parseMsg(buffer).toString();

            if (socketType === 'client') {
                console.log('client receive data : ', socket.name, '>>>', clientString);
                var massage = (new Date()).toISOString() + ' <<<' + socket.name + '>>> ' + clientString;
                broadcast(buildMsg(massage), socket);
            } else if (socketType === 'broadcast') {
                console.log('broadcast receive data : ', socket.name, '>>>', clientString);
                var massage = 'broadcast ' + (new Date()).toISOString() + ' <<<' + socket.name + '>>> ' + clientString;
                broadcast(buildMsg(massage));
            }

        })
        .on('close', function() {
            if (socketType === 'client') removeClientSocket(socket);
            console.log('socket close');
        })
        .on('end', function() {
            if (socketType === 'client') removeClientSocket(socket);
            console.log('socket end');
        });
};


//移除客户端 socket
function removeClientSocket(socket) {
    clientList.splice(clientList.indexOf(socket), 1);
    console.dir('remove socket: ' + socket.name);
}

//广播消息
function broadcast(message, client) {
    var cleanup = [];
    for (var i = 0; i < clientList.length; i += 1) {
        if (client !== clientList[i]) {

            if (clientList[i].writable) {
                clientList[i].write(message);
            } else {
                cleanup.push(clientList[i]);
                //Socket.destroy() -- 关闭套接字
                clientList[i].destory();
            }
        }
    }

    //从写入循环中删除死节点,清楚垃圾索引
    for (i = 0; i < cleanup.length; i += 1) {
        clientList.splice(clientList.indexof(cleanup[i]), 1);
    }
}

//握手协议
var handshake = function(req, socket, head) {
    var output = [],
        h = req.headers,
        br = '\r\n',
        sha1 = crypto.createHash('sha1'),
        key = sha1.update(h["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest('base64');

    // Response Header
    output.push(
        'HTTP/1.1 101 WebSocket Protocol Handshake',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Origin: ' + h.origin,
        'Sec-WebSocket-Location: ws://' + h.host + req.url,
        //'Sec-WebSocket-Protocol: my-custom-chat-protocol',
        'Sec-WebSocket-Accept: ' + key + br + br
    );

    socket.write(output.join(br), 'binary');
}

/**
 *
 * 解析打包数据，实际上payload_len == 127时的打包方法是有待商榷的，这里先这样简单实现
 *
 **/
function parseMsg(data) {
    data = data || null;
    if ((data.length <= 0) || (!Buffer.isBuffer(data))) {
        return null;
    }

    var mask_flag = (data[1] & 0x80 == 0x80) ? 1 : 0; //All frames sent from client to server have this bit set to 1.
    var payload_len = data[1] & 0x7F; //0111 1111

    if (payload_len == 126) {
        masks = data.slice(4, 8);
        payload_data = data.slice(8);
        payload_len = data.readUInt16BE(2);
    } else if (payload_len == 127) {
        masks = data.slice(10, 14);
        payload_data = data.slice(14);
        payload_len = data.readUInt32BE(2) * Math.pow(2, 32) + data.readUInt32BE(6);
    } else {
        masks = data.slice(2, 6);
        payload_data = data.slice(6);
    }
    //console.log(payload_len);
    //console.log(payload_data.length);
    for (var i = 0; i < payload_len; i++) {
        payload_data[i] = payload_data[i] ^ masks[i % 4];
    }

    return payload_data;
}

/**
 * 很简陋的实现打包，并且不支持mask，不支持其他命令，不支持拆包、装包、不支持大于16位长度的数据……
 **/
function buildMsg(str_msg, mask) {
    str_msg = str_msg || "";
    mask = mask || false;

    var msg_len = Buffer.byteLength(str_msg, "utf-8"),
        packed_data;
    if (msg_len <= 0) {
        return null;
    }

    if (msg_len < 126) {
        packed_data = new Buffer(2 + msg_len);
        packed_data[0] = 0x81;
        packed_data[1] = msg_len;
        packed_data.write(str_msg, 2);
    } else if (msg_len <= 0xFFFF) { //用16位表示数据长度
        packed_data = new Buffer(4 + msg_len);
        packed_data[0] = 0x81;
        packed_data[1] = 126;
        packed_data.writeUInt16BE(msg_len, 2);
        packed_data.write(str_msg, 4);
    } else { //用64位表示数据长度
        /*packed_data = new Buffer(10+msg_len);
        packed_data[0] = 0x81;
        packed_data[1] = 127;
        packed_data.writeUInt32BE(msg_len & 0xFFFF0000 >> 32, 2);
        packed_data.writeUInt32BE(msg_len & 0xFFFF, 6);
        packed_data.write( str_msg, 10 );*/
    }
    return packed_data;
}