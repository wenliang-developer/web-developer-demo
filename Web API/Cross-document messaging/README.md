# Cross-document messaging
[TOC]
## support:
browser      | version
---------    | -----
Chrome | 4+
IE (limited) | 8+
Firefox | 3+
Chrome for Android | 38+
iOS Safari | 3.2+
Android Browser | 2.1+
UC Browser for Android | 9.9+
Opera Mini | 5.0-8.0+
Safari | 4+
Opera | 9.5-9.6+
IE Mobile (limited) | 10+
Firefox for Android | 32+

## 如何使用:
### 1.浏览器支持检测
```
if(typeof window.postMessage === undefined){
    //该浏览器不支持 postMessage
}
```
### 2.发送消息
调用目标页面 window.postMessage() 可发送消息,代码如下:
```
window.postMessage("Hello World", "portal.example.com");
```
第一个参数包含要发送的数据,第二个参数是消息传送的目的地. 要发送给 iframe,可以在相应 iframe 的 contentWindow 中调用 postMessage,代码如下:
```
document.getElementByTagName('iframe')[0].contentWindow.postMessage('Hello World','chat.example.net');
```
### 3.监听 message event
```
var originWhiteList = ['portal.example.com','games.example.com','www.example.com'];
function checkWhiteList(origin){
    for(var i=0; i<originWhiteList.length; i++){
        if (origin === originWhiteList[i]){
            return true;
        }
    }
    return false;
}
function messageHandler(e){
    if (checkWhiteList(e.origin)){
        processMessage(e.data);
    } else {
        //忽略来自未知 origin 的消息
    }
}
window.addEventListener("message", messageHandler, true);
```
## example 1:
例如,如果文档 A 的iframe元素包含文档 B,并在文档 B 的 Window 对象上调用 postMessage(),则 message event 就会在文档 B 上触发, 并被标记源于文档 A(origin=A). 文档 A 的脚本可能是这样的:
```
var o = document.getElementsByTagName('iframe')[0];
o.contentWindow.postMessage('Hello world', 'http://b.example.org/');
```
注册一个事件处理传入的事件,该脚本将使用 addEventListener(). 例如, 文档 B 中的脚本可能是这样的:
```
window.addEventListener('message', receiver, false);
function receiver(e) {
  if (e.origin == 'http://example.com') {
    if (e.data == 'Hello world') {
      e.source.postMessage('Hello', e.origin);
    } else {
      alert(e.data);
    }
  }
}
```
该脚本首先检查 domain(域)是否符合预期,然后查看消息,它要么显示给用户,或者通过发送消息以回应发送消息的文档.

## example 2:
现在模拟门户页面和聊天部件之间的交互.

门户页面: http://portal.example.com:9999/postMessagePortal.html
聊天部件: http://chat.example.net:9999/postMessageWidget.html

门户页面以 iframe 的方式嵌入聊天部件. 聊天部件通过父页面标题内容的闪烁来通过用户.

### 部署应用:
1.更新操作系统的 hosts 文件,增加两条指向 localhost(IP 地址为 127.0.0.1)的记录,如下说所示:
```
127.0.0.1   chat.example.net
127.0.0.1   portal.example.com
```
2.配置服务器:
```
node server.js
```