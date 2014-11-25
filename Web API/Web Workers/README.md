# XMLHttpRequest 2
[TOC]

专用 Web Worker (Dedicated Web Worker) 提供了一个简单的方法使得 web 内容能够在后台运行脚本。一旦 worker 创建后，它可以向由它的创建者指定的事件监听函数传递消息，这样该 worker 生成的所有任务就都会接收到这些消息。

worker 线程能够在不干扰 UI 的情况下执行任务。另外，它还能够使用 XMLHttpRequest (虽然 responseXML 与 channel 两个属性值始终是 null)来执行  I/O 操作。

## support:
browser      | version
---------    | -----
Chrome | 31+
IE (limited) | 10+
Firefox | 30+
Chrome for Android | 38+
iOS Safari | 5.1+
Android Browser | 4.4+
UC Browser for Android | 9.9+
Opera Mini | NO
Safari | 5.1+
Opera | 24+
IE Mobile (limited) | 10+
Firefox for Android | 33+

## 关于线程安全
Worker 接口会生成真正的操作系统级别的线程，如果你不太小心，那么并发(concurrency)会对你的代码产生有趣的影响。然而，对于 web worker 来说，与其他线程的通信点会被很小心的控制，这意味着你很难引起并发问题。你没有办法去访问非线程安全的组件或者是 DOM，此外你还需要通过序列化对象来与线程交互特定的数据。所以你要是不费点劲儿，还真搞不出错误来。

## 浏览器支持性检测
```
if(typeof Worker !== 'undefined'){
    console.log("Your brower supports HTML5 Web Workers");
}
```
## 生成 worker
创建一个新的 worker 十分简单。你所要做的就是调用 Worker() 构造函数，指定一个要在 worker 线程内运行的脚本的 URI，如果你希望能够收到 worker 的通知，可以将 worker 的 onmessage 属性设置成一个特定的事件处理函数。
```
var myWorker = new Worker("my_task.js");

myWorker.addEventListener("message", function (oEvent) {
  console.log("Called back by the worker!\n");
}, false);

myWorker.postMessage(""); // start the worker.
```

> ***注意：** 传入 Worker 构造函数的参数 URI 必须遵循 同源策略。目前，不同的浏览器制造商对于哪些 URI 应该遵循同源策略尚有分歧；Gecko 10.0 (Firefox 10.0 / Thunderbird 10.0 / SeaMonkey 2.7) 及后续版本允许传入 data URI，而 Internet Explorer 10 则不认为 Blob URI 对于 worker 来说是一个有效的脚本。*

## 传递数据
在主页面与 worker 之间传递的数据是通过**拷贝**，而不是共享来完成的。传递给 worker 的对象需要经过序列化，接下来在另一端还需要反序列化。页面与 worker **不会共享同一个实例**，最终的结果就是在每次通信结束时生成了数据的一个**副本**。大部分浏览器使用结构化拷贝来实现该特性。
拷贝而并非共享的那个值称为*消息*。再来谈谈 worker，你可以使用 postMessage() 将消息传递给主线程或从主线程传送回来。message 事件的 data 属性就包含了从 worker 传回来的数据。

example.html (主页面):
```
var myWorker = new Worker("my_task.js");

myWorker.onmessage = function (oEvent) {
  console.log("Worker said : " + oEvent.data);
};

myWorker.postMessage("ali");
```

my_task.js (worker):
```
postMessage("I\'m working before postMessage(\'ali\').");

onmessage = function (oEvent) {
  postMessage("Hi " + oEvent.data);
};
```

如你所见，worker 与主页面之间传输的 消息 始终是 「JSON 消息」，即使它是一个原始类型的值。所以，你完全可以传输 JSON 数据 和/或 任何能够序列化的数据类型：
```
postMessage({"cmd": "init", "timestamp": Date.now()});
```

> ***注意：** 通常来说，后台线程 – 包括 worker – **无法操作 DOM**。 如果后台线程需要修改 DOM，那么它应该将消息发送给它的创建者，让创建者来完成这些操作。*

## 引入脚本与库
对于由多个 JavaScript 文件组成的应用程序来说，可以通过包含`<script>`元素的方式,在页面加载的时候同步加载 JavaScript 文件。然而，由于 Web Workers 没有访问 document 对象的权限，所以在 worker 中必须使用另外一种方式导入其他 JavaScript 文件 —— importScript。

Worker 线程能够访问一个全局函数 importScripts()，该函数允许 worker 将脚本或库引入自己的作用域内。你可以不传入参数，或传入多个脚本的 URI 来引入；以下的例子都是合法的：
```
importScripts();                        /* 什么都不引入 */
importScripts('foo.js');                /* 只引入 "foo.js" */
importScripts('foo.js', 'bar.js');      /* 引入两个脚本  会按顺序执行 */
```
## 终止 worker
Web Worker 不能自行终止。被终止的 worker 将不再响应任何信息或者执行任何其他的计算。终止之后，worker 不能被重新启动，但可以使用同样的 URL 创建一个新的 worker。

如果你想立即终止一个运行中的 worker，可以调用 worker 的 terminate()方法：
```
myWorker.terminate();
```
worker 线程会被立即杀死，不会留下任何机会让它完成自己的操作或清理工作。

Workers 也可以调用自己的 nsIWorkerScope.close() 方法来关闭自己：
```
self.close();
```

## 错误处理
当 worker 出现运行时错误时，它的 onerror 事件处理函数会被调用。它会收到一个实现了 ErrorEvent 接口名为 error的事件。该事件不会冒泡，并且可以被取消；为了防止触发默认动作，worker 可以调用错误事件的 preventDefault() 方法。

错误事件拥有下列三个它感兴趣的字段：

- message
可读性良好的错误消息。
- filename
    发送错误的脚本文件名
- lineno
    发生错误时所在脚本文件的行号。

## 访问 navigator 对象
Workers 可以在它的作用域内访问 navigator 对象。它含有如下能够识别浏览器的字符串，就像在普通脚本中做的那样:

- appName
- appVersion
- platform
- userAgent

## 定时器的使用
虽然 HTML5 Web Workers 不能访问 window 对象，但是它可以与属于 window 对象的 JavaScript Timer API 协作：
```
var timer = setTimeout(postMessage, 2000, 'delayed message');
```
## example - 图像模糊过滤器：

包含文件：

- blur.js
    JavaScript box-blur 过滤器的实现。
- blur.html
    图像模糊应用页面。
- blurWorker.js
    处理图像的 worker。

运行程序:
```
node server.js
```
访问链接 http://localhost:9999/blur.html。

> **Canvas imageData 序列化**

> postMessage 可以对 imageData 对象进行高度序列化。不过一些支持 Web Worker 和 postMessage API 的浏览器也许还不能支持 postMessage 的这种扩展的序列化能力。

> 因此图像模糊处理的示例中，以传递 imageData.data(数据序列化同 JavaScript Array 一样)的方式传送 imageData 对象本身。