# [JavaScript Threading With HTML5 Web Workers][1] (译文)

忘记 `transforms`，`native video`，语义标记和其他一些无聊的 `HTML5` 废话；`web workers` 终于允许开发人员当前进程中允许一个单独的线程。
线程听起来非常复杂，有些开发语言使它非常棘手，但你一定会很高兴的听到，`JavaScript` 的实现是好的并且 W3C 工作草案以保持稳定。`Web workers` 为 客户端提供了巨大的性能提升，但在我们开始之前，也有几件事情要注意...

## Web Worker 的限制
`Web worker` 操作独立于浏览器的 `UI thread`，因此它们无法访问许多 `JavaScript` 开发人员熟悉和喜欢的功能。主要的限制是，`Web workers` 无法进入 `DOM`；它们无法读取或修改 `HTML` 文档。此外，你也无法访问页面内的 `global variables` 或 `JavaScript functions`。最后，获取某些对象被限制，如 `window.location` 的属性是只读的。
然而，`web workers` 可以使用标准的 `JavaScript` 数据类型，处理 `XMLHttpRequest(Ajax)` 调用，使用 `timers`，甚至可以导入其他 `workers`。它们是处理如数据分析，`game AI logic`，`ray-tracing`(光线分析，图形处理任务) 等任务的地方。

## Web Worker Browser Support
在写这篇文章的时候，所有的最新版本 `Firefox`，`Chrome`，`Safari` 和 `Opera` 在一定程度上支持 `Web workers`。
毋庸置疑，`Web workers` 在 `Internet Explorer` 中实现。即使 `IE9` 也不支持，但可能在最终版本中实现，你有三种选择：

 - 忘记 `Web workers` 一两年。
 - 接受你的应用程序将在 `IE` 中失效。
 - 实现自己的 `Web workers shim`(垫片) 会退到 timer-based [pseudo-threading][2] 或 [array processing][3]。在所有应用程序中这可能并不可取或不可能实现。

## What is Web Worker？
一个 web worker 是加载一个单独的 `JavaScript` 文件并在后台执行。有两种类型：

 - **Dedicated workers** (专用的 worker)：这些被 `linked` 到它们的 `creator`(加载 worker 的脚本)。
 - **Shared workers** (共享的 `worker`)：允许来自同一个 `domain`(somesite.com) 与 `worker` 进行通信。

现在我们讨论 `Dedicated Web Workers`。

## Creating a Dedicated Web Worker
要创建一个 `Dedicated web  worker`，你需要在创建 `Worker` 实例时传入一个 `JavaScript` 文件名。
```javascript
var worker = new Worker("thread1.js");
```

## Communicating With a Dedicated Web Worker
由于 `Web worker` 不能访问页面中的 `DOM` 或函数，所有的通信都通过 `event interface` 进行处理。该网页脚本通过 `postMessage()` 方法传递一个 `data` 参数，并通过 `onMessage` 事件处理程序接受 `data`。例如：

**pagescript.js：**
```javascript
var worker = new Worker("thread1.js");

// receive messages from web worker
worker.onmessage = function(e) {
	alert(e.data);
};

// send message to web worker
worker.postMessage("Jennifer");
```
`web worker` 通过 `onMessage` 事件处理程序和自己的 `postMessage()` 发送来接受和发送的数据：

**thread1.js：**
```javascript
self.onmessage = function(e) {
	self.postMessage("Hello " + e.data);
};
```
这个 `message data` 可以是 `string`，`number`，`boolean`，`array`，`object`，`null` 或 `undefined`。`data` 总是按值传递，并在通信过程中序列化然后反序列化。

## Handling Dedicated Web Worker Errors
`Web worker code` 不可是完美的，并且 `logic error` 可能由页面脚本传递的 `data` 引发。幸运的是，`error` 可以使用 `onerror` 事件处理程序捕获。错误处理程序中传递一个 `error` 对象，它有三个属性：

 - **filename**：造成错误的脚本的名称。
 - **lineno**：发生错误的行号。
 - **message**：所述错误的描述。

**pagescript.js:**
```javascript
worker.onerror = function(e) {
	alert("Error in file: "+e.filename+"nline: "+e.lineno+"nDescription: "+e.message);
};
```

## Loading Further JavaScript Files
可以在 `web worker` 中使用 `importScript()`，导入一个或多个其余的 `JavaScript` libraries。例如：
```javascript
importScripts("lib1.js", "lib2.js", "lib3.js");
```
另外，你也可以加载更多的 `web  workers` ...，不过，我建议你保持简单，直到浏览器性能赶上你的多个线程时。

## Stopping a Dedicated Web Worker
`web worker thread` 可以使用 `close()` 来停止，例如。

**thread1.js:**
```javascript
self.onmessage = function(e) {
	if (e.data == "STOP!") self.close();
};
```
这会放弃任何等待处理的任务并且防止进一步的事件被排队。
这就是关于 `dedicated web workers` 你所需要知道的。下一篇文章中，我们将讨论 [shared web workers][4] —— 一个很复杂的野兽！

  
  [1]: http://www.sitepoint.com/javascript-threading-html5-web-workers/
  [2]: http://www.sitepoint.com/javascript-timer-pseudo-threading/
  [3]: http://www.sitepoint.com/javascript-large-data-processing/
  [4]: http://www.sitepoint.com/javascript-shared-web-workers-html5/
  
 