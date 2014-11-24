# XMLHttpRequest 2
[TOC]

## support:
browser      | version
---------    | -----
Chrome | 31+
IE (limited) | 10+
Firefox | 30+
Chrome for Android | 38+
iOS Safari | 3.2+
Android Browser | 2.1+
UC Browser for Android | 9.9+
Opera Mini | NO
Safari | 5.1+
Opera | 24+
IE Mobile (limited) | 10+
Firefox for Android | 33+

## Cross-Origin XMLHttpRequest
XMLHttpRequest Level 2 通过 CORS (Cross Origin Resource Sharing，跨源资源共享) 实现了 Cross-origin XMLHttpRequest。

跨源 HTTP 请求包括一个 Origin Header，它为服务器提供了 HTTP 请求的 origin 信息。Origin Header 由浏览器保护，不能被应用程序代码更改。从本质上讲，它与 Cross-document messaging 中的 message event 的 origin 属性作用相同。Origin Header 不同于早先的 Referer[sic] Header，因为后者中的 Referer 是一个包含了路径的完整 URL。由于路径可能包含敏感信息，为了保护用户隐私，浏览器并不一定会发送 Referer，而浏览器在任何的时候都会发送 Origin Header。 

CORS 规范要求，对一些敏感行为 —— 如申请证书的请求除了 GET 和 POST 以外的 OPTIONS 预检(preflight)请求，必须由浏览器发送给服务器，以确定这种行为能否被支持和允许，这意味着成功通信的背后或许需要由具备 CORS 处理能力的服务器来支持。下面的代码展示了托管 www.example.com 页面与 www.example.net 的服务器之间用户 Cross-origin 交换的 HTTP Header。

**Cross-origin request headers :**
```
POST /main HTTP/1.1
Host: www.example.net
User-Agent: Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1.3) Gecko/20090910 Ubuntu/9.04
(jaunty) Shiretoko/3.5.3
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Keep-Alive: 300
Connection: keep-alive
Referer: http://www.example.com/
Origin: http://www.example.com
Pragma: no-cache
Cache-Control: no-cache
Content-Length: 0
```
**Cross-origin response headers :**
```
HTTP/1.1 201 Created
Transfer-Encoding: chunked
Server: Kaazing Gateway
Date: Mon, 02 Nov 2009 06:55:08 GMT
Content-Type: text/plain
Access-Control-Allow-Origin: http://www.example.com
Access-Control-Allow-Credentials: true
```
## Properties
API Name      | Summary
---------    | -----
readyState   |	返回 XMLHttpRequest 的当前状态.
response     | 返回 response 的 entity body(实体正文), 它是 response 到目前为止已接收的 entity body 的片段(如果为 LOADING) 或response 的完整 entity body (如果为 DONE).
responseText |	返回 response 的 entity body(实体正文)的文本, 它是 response 到目前为止已接收的 entity body 的片段(如果还在加载) 或response 的完整 entity body (如果为 DONE) 的字符串.
responseType | 设置 response 返回的格式。
responseXML	| 返回 request 完成后 response 的 DOM Document object, 如果为 null 或者请求失败, 将不能解析为 XML or HTML.
status	| 返回 response 的 HTTP result code(状态)。
statusText	| 返回 HTTP status 文本。
timeout	| 返回或设置一个毫秒数，超出改时间 request 自动被终止。
upload	| 返回相关的 XMLHttpRequestUpload 对象。他可以被用于收集发送给服务器的数据。
withCredentials	| 返回或设置时候 cross-site Access-Control requests 要求使用的 credentials(证书)，如 cookies 或 authorization headers(授权头)。

## Methods
API Name      | Summary
---------    | -----
abort	| 停止正在进行异步 XMLHttpRequest。
getAllResponseHeaders | 返回所有 response headers 的字符串，如果 response 没有收到，则为 null。
getResponseHeader | 返回包含指定 header 的字符串，如果 response 尚未收到或者 header 不存在，则为 null。
open | 初始化一个 XMLHttpRequest.
overrideMimeType | 覆盖由服务器返回的 MIME type。
send | 发送 XMLHttpRequest 所定义的 request。
setRequestHeader | 设置一个 XMLHttpRequest header 的值。

## Events
API Name      | Summary
---------    | -----
abort | 当请求已经中止。例如, 通过调用 abort() method.
error | 当请求失败.
load | 但请求成功完成.
loadend | 但请求已经完成 (在 success or failure).
loadstart | 当请求启动.
progress | 正在 sending 和 loading data.
readystatechange | 当 request readyState 改变时触发。大多用于确定是否可以处理 response 的 body。
timeout | 当超过指定的时间请求还没有完成时触发.

## example 1:
该脚本演示了如何跨域访问资源。例如：siteA.com 从 siteB.com 获取资源。
```
// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE 9 and earlier.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
  // All HTML5 Rocks properties support CORS.
  var url = 'http://updates.html5rocks.com';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };
  
  xhr.send();
}
```
**progress event**
```
crossOriginRequest.onprogress = function(e) {
    var total = e.total;
    var loaded = e.loaded;
    if (e.lengthComputable) {
        // do something with the progress information
    }
}
crossOriginRequest.upload.onprogress = function(e) {
    var total = e.total;
    var loaded = e.loaded;
    if (e.lengthComputable) {
        // do something with the progress information
    }
}
```

## example 2:
该示例，将把位置坐标上传到 Cross-origin Web Server，并使用 progress event 监控包括上传进度在内的 HTTP 请求的状态。

**部署应用**

1.更新 hosts 文件，添加如下两个指向 localhost(IP 地址为 127.0.0.1)的项：
```
127.0.0.1 geodata.example.net
127.0.0.1 portal.example.com
```
2.运行 node 脚本：
```
node server.js
```
3.打开浏览器，输入 http://portal.example.com:9999/crossOriginUpload.html