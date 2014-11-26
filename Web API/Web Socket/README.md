# Web Sockets
[TOC]

## support:
browser      | version
---------    | -----
Chrome | 31+
IE (limited) | 10+
Firefox | 30+
Chrome for Android | 39+
iOS Safari | 6.0+
Android Browser | 4.4+
UC Browser for Android | 9.9+
Opera Mini | NO
Safari | 5.1+
Opera | 24+
IE Mobile (limited) | 10+
Firefox for Android | 33+

## WebSocket 握手
为了建立 WebSocket 通信，客户端和服务器在初始握手时，将 HTTP 协议升级到 WebSocket 协议。

**WebSocket 升级握手**

websocket 协议有多个版本，以最新版的 `RFC 6455` 为例。

From client to server:
> GET / HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Host: example.com
Origin: null
Sec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==
Sec-WebSocket-Version: 13

From server to client:
> HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
Sec-WebSocket-Origin: null
Sec-WebSocket-Location: ws://example.com/


**Sec-WebSocket-Accept 生成原理**

在请求中的“Sec-WebSocket-Key”是随机的，服务器端会用这些数据来构造出一个SHA-1的信息摘要。

把“Sec-WebSocket-Key”加上一个魔幻字符串“258EAFA5-E914-47DA-95CA-C5AB0DC85B11”。使用SHA-1加密，之后进行BASE-64编码，将结果做为“Sec-WebSocket-Accept”头的值，返回给客户端。

用 node 实现的代码片段：
```
sha1 = crypto.createHash('sha1');
sha1.update(headers["Sec-WebSocket-Key"]+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
ws_accept=sha1.digest('base64');
```


一旦连接建立成功，就可以在全双工模式下在 client 和 server 之间来回传递 WebSocket message。在网络中，每个消息以 0x00 字节开头，以 0xFF 结尾，中间数据采用 UTF-8 编码格式。
在客户端和服务器之间的初始化握手阶段，基于同一底层 TCP/IP 连接，将 HTTP 协议升级至 WebSocket 协议。

## WebSocket protocal frame(协议帧)

     0                   1                   2                   3
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-------+-+-------------+-------------------------------+
    |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
    |I|S|S|S|  (4)  |A|     (7)     |             (16/63)           |
    |N|V|V|V|       |S|             |   (if payload len==126/127)   |
    | |1|2|3|       |K|             |                               |
    +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
    |     Extended payload length continued, if payload len == 127  |
    + - - - - - - - - - - - - - - - +-------------------------------+
    |                               |Masking-key, if MASK set to 1  |
    +-------------------------------+-------------------------------+
    | Masking-key (continued)       |          Payload Data         |
    +-------------------------------- - - - - - - - - - - - - - - - +
    :                     Payload Data continued ...                :
    + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
    |                     Payload Data continued ...                |
    +---------------------------------------------------------------+


## WebSocket 接口
```
[Constructor(DOMString url, optional (DOMString or DOMString[]) protocols)]
interface WebSocket : EventTarget {
  readonly attribute DOMString url;

  // ready state
  const unsigned short CONNECTING = 0;
  const unsigned short OPEN = 1;
  const unsigned short CLOSING = 2;
  const unsigned short CLOSED = 3;
  readonly attribute unsigned short readyState;
  readonly attribute unsigned long bufferedAmount;

  // networking
           attribute EventHandler onopen;
           attribute EventHandler onerror;
           attribute EventHandler onclose;
  readonly attribute DOMString extensions;
  readonly attribute DOMString protocol;
  void close([Clamp] optional unsigned short code, optional DOMString reason);

  // messaging
           attribute EventHandler onmessage;
           attribute DOMString binaryType;
  void send(DOMString data);
  void send(Blob data);
  void send(ArrayBuffer data);
  void send(ArrayBufferView data);
};
```
WebSocket 接口的使用很简单。要连接远程主机，只需要新建一个 WebSocket 实例，提供希望连接的URL。注意，`ws://`和`wss://`前缀分别代表 WebSocket 连接和安全的 WebSocket 连接。

## 浏览器兼容性检测
```
isWebSocketSupport = window.WebSocket ? true : false;
```

## WebSocket API 基本用法

1.WebSocket 对象的创建及其与 WebSocket 服务器的连接

```
var url = "ws://localhost:8080/WebSockerServer";
var w = new WebSocket(url);
```

2.添加事件监听器

WebSocket 编程遵循异步编程模型，打开 socket 后，只需要等待事件发生，而不需要主动向服务器轮询。

WebSocket 对象有三个事件：open、close 和 message。当连接建立时触发 open 事件、当收到消息时触发 message 事件、当 WebSocket 连接关闭时触发 close 事件。
```
w.onopen = function() {
    log("open");
    w.send("thank you for accepting this websocketrequest");
}
w.onmessage = function(e) {
    log(e.data);
}
w.onclose = function(e) {
    log("closed");
}
```

3.发送消息

当 socket 处于打开状态，可以采用 send() 方法来发送消息。
```
document.getElementById("sendButton").onclick = function() {
    w.send(document.getElementById("inputMessage").value);
}
```

## example :
包含文件：

- websocket.html
    客户端主页面
- server.js
    服务器脚本。
- broadcast.html
    通知页面。

运行程序：
```
node server.js
```
访问链接： 
用户主页面 - http://localhost:9999/websocket.html。
广播页面 - http://localhost:9999/broadcast.html
