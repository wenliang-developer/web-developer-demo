# requestAnimationFrame

[TOC]

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
Safari | 6.1+
Opera | 24+
IE Mobile (limited) | 10+
Firefox for Android | 33+

[W3C Timing control for script-based animations][1] 规范定义了 Web 开发人员基于脚本编写动画的 API，User agents 拥有限制动画更新率的控制权。User agents 根据当前页面是在前台或后台标签页、CPU 的当前负载，等等因素，来确定一个更好的理想动画速率。因此使用此 API 能够使浏览器更适当的利用CPU。
浏览器可以优化并发的动画组合成一个单一的重排和重绘周期，从而形成更高保真度的动画。例如，JS-based animations synchronized 与 CSS transitions 或 SVG SMIL 同步。

## 简介
在浏览器中动画有两种形式：原生的，通过声明式定义的，比如 SVG 的 `<animate>` 元素和通过脚本执行的。这些基于脚本的动画通常使用 setTimeout 或 setInterval 调用回调函数，以此来更改 DOM 来实现动画刷新。
这种方法的缺点是动画脚本的开发者根本不知道动画刷新的理想速率是多少。相反，最简单的方法是在使用 setTimeout 时简单的设定一个很小的值，这在实践中只能设定一个固定的时间值，例如 10ms。动画可能不会每秒刷新 100 次，特别是在当前网页是一个背景标签页或者浏览器最小化的时候。
该 API 运行开发人员，要求 User agents 安排一个动画更新速率。User agents 为整个浏览器中运行的动画分配一个更好的动画刷新率。如果动画正在活动，User agents 会选择一个帧速率，使得这些动画尽可能流畅的运行。如果当前页面不可见，则降低动画的帧速率，以节省 CPU 资源。

*Example - 使用该 API 编写基于脚本的动画：*
```html
<!DOCTYPE html>
<title>Script-based animation using requestAnimationFrame</title>
<style>
div { position: absolute; left: 10px; padding: 50px;
  background: crimson; color: white }
</style>
<script>
var requestId = 0;

function animate(time) {
  document.getElementById("animated").style.left =
    (time - animationStartTime) % 2000 / 4 + "px";
  requestId = window.requestAnimationFrame(animate);
}
function start() {
  animationStartTime = window.performance.now();
  requestId = window.requestAnimationFrame(animate);
}
function stop() {
  if (requestId)
    window.cancelAnimationFrame(requestId);
  requestId = 0;
}
</script>
<button onclick="start()">Click me to start!</button>
<button onclick="stop()">Click me to stop!</button>
<div id="animated">Hello there.</div>
```

## 定义
每一个 [Document][interface Document] 都有一个 **animation frame request callback list**，是一个结构为 `<handle, callback>` 的列表。handle 是一个整数，唯一标识列表中的条目。callback是一个 FrameRequestCallback 对象。最初这个 **animation frame request callback list** 为空。
当 [Document][interface Document] 具有一个活动的动画时，它有非空的 **animation frame request callback list**。

## 扩展 Window interface
下面的 IDL 片段用于在 Window 对象上暴露 requestAnimationFrame 操作。
```IDL
partial interface Window {
  long requestAnimationFrame(FrameRequestCallback callback);
  void cancelAnimationFrame(long handle);
};

callback FrameRequestCallback = void (DOMHighResTimeStamp time);
```
requestAnimationFrame() 用于通知 User agents 基于脚本的动画需要重新采样。当 `requestAnimationFrame(callback)` 被调用，user agents 必须将一个 script-based animation resampling(脚本为基础的动画重采样)追加到  **animation frame request callback list** 的末尾，其 `handle` 是一个 user-agent-defined(用户代理定义的)大于零的唯一标识列表条目的整数，其 `callback` 是 requestAnimationFrame 的 callback 参数。

每个 FrameRequestCallback 对象都有一个 **cancelled** boolean flag。这个标志最初为 false，并且没有被任何接口公开。
> NOTE:
requestAnimationFrame 只调度基于脚本的动画的一个更新。如果随后需要动画帧，那么需要再次调用 requestAnimationFrame。
还要注意的是多次调用 requestAnimationFrame 并使用相同的 `callback`(before [callbacks are invoked](http://www.w3.org/TR/animation-timing/#dfn-invoke-callbacks-algorithm) and the list is cleared)，将导致列表中有多个条目具有相同的 `callback`，使得在一次动画帧上 `callback` 将调用多次。

cancelAnimationFrame() 用于取消先前请求的动画帧更新。当 cancalAnimationFrame(**handle**) 被调用，user agents 必须将注册在 [Document][interface Document] 中 `handle` 等于 **handle** 对应的 `callback` 的 cancelled flag 设为 true。如果改 `callback` 在 [Document][interface Document] 的 **animation frame request callback list** 中并没有找到，则该函数什么也不做。

## 处理模式
每当一个 [Document][interface Document] 的 hidden 属性为 false 并且 **animation frame request callback list** 不为空，则 user agents 必须将一个 task 定期排入队列。该 task 获取 **samples all animations** 的 Document's [top-level browsing context][top-level browsing context]。task source 是这些 animations task source。即使多个 [Document][interface Document] 中相同的 top-level browsing context 没有隐藏和包含回调函数，也只有一个 task 来每次生成 Document's [top-level browsing context][top-level browsing context]。对 samples all animations，执行一下步骤：

1. 设 `list` 是一个空的 **animation frame request callback list**。
2. 设 `contexts` 是 [top-level browsing context][top-level browsing context] 完成 [list of the descendant browsing contexts](http://www.w3.org/TR/html5/browsers.html#list-of-the-descendant-browsing-contexts) 算法任务返回的后代浏览器上下文的结果。
3. 每当 `context` 按任意顺序出现在 `contexts` 中，请执行一下步骤：
	1. 设 `time` 是在 `context` 中调用 Performance 接口的 now() 方法返回的结果。
	2. 设 `d` 是 `context` 的 [active document](http://www.w3.org/TR/html5/browsers.html#active-document)。
	3. 如果 `d` 的 hidden 属性为 true，`contexts` 列表的下一个条目继续执行前两个步骤。否则，继续执行后续步骤。
	4. 设 `doclist` 是 `d` 的 **animation frame request callback list**。
	5. 将 `doclist` 的所有条目追加到 `list`中。
	6. 清空 `doclist`。
4. 执行步骤定义在 **invoke callbacks algorithm** 中，参数为 `list`。

**invoke callbacks algorithm**(执行回调函数算法)：
1. `list` 中的每个条目，依次：
	1. 如果 `callback` 的 cancelled 属性不为 true：
		1. 调用 `callback` 以回调的上下文的 `time` 作为参数。
		2. 如果调用操作导致抛出异常，则捕获该异常并忽略它。

> NOTE:
> 我们期望的是，user agents 将在一定的时间间隔匹配显示器的刷新率，来运行 animation task source 的任务。以较低的速度运行任务可能会导致动画不流畅。以较高的速度运行任务可能会导致发生额外的计算，这都是用户不愿意见到的。


## 应该如何使用？
```javascript
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
})();
```
### 一个强大的 polyfill
Opera 工程师 "Erik Möller" 写了一段代码能更好的处理没有支持原生 requestAnimationFrame 的浏览器。你可以阅读以下，不过基本上他的代码会选择 4ms~16ms 之间的延迟，以更接近 60fps。在这里，如果你喜欢使用它。注意，它使用标准的方法名称。我还修复了 `cancel*` 方法的名称，因为它在 WebKit 发生的变化。

```javascript
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
```

### Dome
```javascript
// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

var canvas, context, toggle;

init();
animate();

function init() {

    canvas = document.createElement( 'canvas' );
    canvas.width = 512;
    canvas.height = 512;

    context = canvas.getContext( '2d' );

    document.body.appendChild( canvas );

}

function animate() {
    requestAnimFrame( animate );
    draw();

}

function draw() {

    var time = new Date().getTime() * 0.002;
    var x = Math.sin( time ) * 192 + 256;
    var y = Math.cos( time * 0.9 ) * 192 + 256;
    toggle = !toggle;

    context.fillStyle = toggle ? 'rgb(200,200,20)' :  'rgb(20,20,200)';
    context.beginPath();
    context.arc( x, y, 10, 0, Math.PI * 2, true );
    context.closePath();
    context.fill();

}
```

<iframe width="100%" height="300" src="http://jsfiddle.net/wenliang_developer/vg0q9uah/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## 参考链接

- [W3C Timing control for script-based animations - CR - 2013.10.31][1]
- [requestAnimationFrame 支持性检测][2]
- [requestAnimationFrame for Smart Animating][3]


  
  [1]: http://www.w3.org/TR/animation-timing/#requestAnimationFrame "Timing control for script-based animations W3C Candidate Recommendation 31 October 2013"
  [2]: http://caniuse.com/requestanimationframe
  [3]: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  
  [interface Document]: http://www.w3.org/TR/domcore/#interface-document
  [top-level browsing context]: http://www.w3.org/TR/html5/browsers.html#top-level-browsing-context