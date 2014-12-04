# [How to Use JavaScript Shared Web Workers in HTML5][1] (译文)

我们最近讨论了 [JavaScript Web Workers][2] 中的 `Dedicated Web Workers`，如果你有没有读过，建议你先阅读它 —— 本篇文章建立在相同的概念上。

## Web Workers in a Nutshell
一个 `web worker` 是在一个 `JavaScript` 文件中加载并在后台执行的一个独立的线程。`Dedicated web workers` linked 在它们的创建者(加载 `worker` 的脚本)。`Shared web workers` 允许任意数量的脚本与 `worker` 通信。

`Shared web workers` 坚持相同的规则与 `dedicated` 对应：没有 `DOM`，`document` 或访问页面脚本，并且限制 `window` 的大多数属性为只读。此外，页面脚本只能与来自同一个 `origin/domain`(somesite.com) 的 `web workers` 进行通信。

目前 `Shared Web Worker` 在 `Chrome`，`Safari` 和 `Opera` 的支持。`Shared Web Worker` 可以节省资源，但它们增加了额外的复杂度。预期有这样一些问题，例如：

 - `DOM2 events (addEventListener) handlers` 似乎是最可靠的实现。
 - 你几乎肯定会遇到浏览器特定的怪癖和困难的调试。在 `Chrome` 最新版本下工作的代码，但不要以为它会在 `Safari` 和 `Opera` 中能够工作。

## Creating a Shared Web Worker
要创建一个 `shared web worker`，你需要传递 `JavaScript` 文件名为实例化 `SharedWorker` 对象时的参数：
```javascript
var worker = new SharedWorker("jsworker.js");
```
## Communicating with a Shared Web Worker
你的任何页面脚本都可以与 `Shared Web Worker` 通信。不同于 `Dedicated Web Worker`，你必须通过 'prot' 对象并附加个 `message event handler`。此外，你必须在第一次使用 `postMessage()` 方法之前调用 `port` 的 `start()` 方法。

**pagescript.js:**
```javascript
var worker = new SharedWorker("jsworker.js");

worker.port.addEventListener("message", function(e) {
	alert(e.data);
}, false);

worker.port.start();

// post a message to the shared web worker
worker.port.postMessage("Alyssa");
```
当 `web worker script` 接受从脚本接受的第一个 `message`，把必须必须附加一个事件处理程序到 `active port`。在大多数情况下，该处理程序将运行自己的 `postMessage()` 方法，将 `message` 返回給调用代码。最后该 `port` 的 `start()` 方法也必须执行，启用消息传递：

**jsworker.js:**
```javascript
ar connections = 0; // count active connections

self.addEventListener("connect", function (e) {

	var port = e.ports[0];
	connections++;

	port.addEventListener("message", function (e) {
		port.postMessage("Hello " + e.data + " (port #" + connections + ")");
	}, false);

	port.start();

}, false);
```
跟它的兄弟 `dedicated web worker` 一样，`shared web worker` 可以：

 - 使用 `importScripts()` 再次加载脚本。
 - 附加的 `error` 处理程序。
 - 运行 `port.close()` 方法阻止特定 `port` 上进行的通信。

`Shared web workers` 恐怕在几年内不会是一个可行的技术，但它为 `JavaScript development` 的未来提供了令人兴奋的机遇。希望浏览器厂商可以提供几个像样的跟踪和调试工具。

  [1]: http://www.sitepoint.com/javascript-shared-web-workers-html5/
  [2]: http://www.sitepoint.com/javascript-threading-html5-web-workers/
  
 