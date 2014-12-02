# High Resolution Time API

[TOC]

browser      | version
---------    | -----
Chrome | 31+
IE (limited) | 10+
Firefox | 30+
Chrome for Android | 39+
iOS Safari | 8
Android Browser | 4.4
UC Browser for Android | 9.9+
Opera Mini | NO
Safari | 8+
Opera | 24+
IE Mobile (limited) | 10+
Firefox for Android | 33+

该规范定义了一个提供 `sub-millisecond resolution`(亚毫秒级精确度，也就是毫秒的千分之一) 的当前时间，并且不受系统时钟偏移和调整影响的接口。

## 简介
`ECMAScript` 语言规范中的 `Date` 对象定义了一个自 1970 年 1 月 1 日 UTC 所经历的 `ms` 为单位的时间。在大多数情况下，这个时间定义是足够的，因为这个值代表的时间精确到 `ms`。
在实践中，`time` 的这些定义受到系统时钟的偏移和调整，这两个因素的影响。随后的时间值可能并不总是单调递增，也可能减少或保持不变。

例如下面的值，可能是一个正数、负数或零。

```javascript
var mark_start = Date.now();
doTask(); // Some task
if (window.console) window.console.log('Duration of task: ' + (Date.now() - mark_start));
```

对于某些任务 `time` 的这一定义可能并不足够，因为它不容许 `sub-millisecond resolution` 受到系统时钟偏移的影响。例如：

- 当浏览文档，试图精确测量该文档获取资源或执行脚本所经过的时间。这就期望 `sub-millisecond resolution` 是单调递增的。
- 当使用脚本计算动画状态，开发者需要准确知道动画已经过去的时间量，以便正确更新动画的下一个场景。
- 当基于脚本计算 animation frame 的速率，开发人员需要精确到 sub-millisecond resolution，以确定动画绘制帧率是否为 `60 FPS`。如果没有 sub-millisecond resolution，开发人员只能确定动画绘制帧率在 `58.8 FPS` 或 `62.5 FPS`。
- 为了动画在一个特定点提示音频或确保音频与动画同步，开发人员将需要准确知道动画和声音经过的时间量。

本规范不建议改变 `Data.now()` 的行为，因为很长一段时间都使用它来确定当前的日历时间。 接口 `Performance` 的 `DOMHighResTimeStamp  now()` 方法通过提供单调递增的 sub-millisecond resolution 的时间值，解决了之前的问题。

## DOMHighResTimeStamp Type
`DOMHighResTimeStamp` 类型是用来存储相对于 [PerformanceTiming][3] 接口的 `navigatorStart`(文档导航的开始时间) 属性经历的时间值，或代表两个 `DOMHighResTimeStamps` 之间的持续时间。

**Type Definition DOMHighResTimeStamp**

一个 `DOMHighResTimeStamp` 应该代表精确到毫秒的千分之一的时间值。
> *NOTE:* 
*如果 User agents 由于硬件或软件的原因不能提供 千分之一毫秒精确度的时间，User agents 可以使 DOMHighResTimeStamp 代表一个毫秒精确度的时间。*

IDL Definition

```IDL
typedef double DOMHighResTimeStamp;
```

## Performance 接口
```IDL
partial interface Performance {
  DOMHighResTimeStamp now();
};
```
`now` method：该方法返回一个 `DOMHighResTimeStamp` 表示当前时间(以毫秒为单位)。时间戳是非常准确的，精确度为毫秒的千分之一。请注意，虽然 `Data.now()` 返回自 1970年1月1日 经过的毫秒数 UTC00:00:00,`performance.now()` 返回从 `performance.timing.navigationStart()`，文档的导航开始，到 `performance.now()` 调用相差的毫秒数，用小数部分表示微秒。`Date.now()` 和 `performance.now()` 之间的另一个重要区别是，后者是单调递增的，所有两次调用之差永远不会为负。

## Monotonic Clock(单调时钟)
调用 `now()` 时，返回的时间值必须是单调递增的，不受系统时钟调整或系统时钟偏移。按顺序调用 `now()` 返回的时间值一定是递增的。

## 如何使用
也许你想知道如何使用 `High Resolution Time API`。好消息是，它不会改变任何东西。你所需要做得是将 `Data.now()` 替换为 `performance.now()`，以增加你测量的精度。例如：
```javascript
var startTime = performance.now();
 
// A time consuming function
foo();
var test1 = performance.now();
 
// Another time consuming function
bar();
var test2 = performance.now();
 
// Print more accurate results
console.debug("Test1 time: " + (test1 - startTime));
console.debug("Test2 time: " + (test2 - test1));
```

## 兼容性
目前，兼容这个 API 的浏览器并不多。由于并没有得到全面支持，你需要做得第一件事是创建一个函数来检测浏览器是否支持，或是否以前缀的形式支持。下面的函数，如果浏览器的 API 没有前缀，则返回空字符串。如果有前缀则返回前缀。如果不支持，则返回 `null`。
```javascript
function getPrefix() {
  var prefix = null;
  if (window.performance !== undefined) {
    if (window.performance.now !== undefined)
      prefix = "";
    else {
      var browserPrefixes = ["webkit","moz","ms","o"];
      // Test all vendor prefixes
      for(var i = 0; i < browserPrefixes.length; i++) {
        if (window.performance[browserPrefixes[i] + "Now"] != undefined) {
          prefix = browserPrefixes[i];
          break;
        }
      }
    }
  }
  return prefix;
}
```

对于不支持这个 API 的浏览器，需要一个替代品。
替代品的作者 `Tony Gentilcore`，是 API 的贡献者之一。
在他的文章中，题为 "A better timer for JavaScript",Gentilcore 写到，先检测浏览器是否支持，并使用 `Date.getTime()` 作为后备代码"。下面的代码示例：
```javascript
window.performance = window.performance || {};
performance.now = (function() {
  return performance.now       ||
         performance.mozNow    ||
         performance.msNow     ||
         performance.oNow      ||
         performance.webkitNow ||
         function() { return new Date().getTime(); };
})();
```

## Demo
本节将指导你完成一个简单的演示页面。该演示检测浏览器的支持下，然后再调用 `doBenchmark()` 方法，该方法依赖于两个假的方法。请注意，我介绍的 `getTime()`，是不相关的 API。其唯一的目的是为了避免无用的重复，使代码保持清晰。演示的源代码如下所示：
```html
<!DOCTYPE html>
<html>
  <head>
    <title>High Resolution Time API Test Page</title>
    <script>
      function foo() {
        for(var i = 0; i < 10000000; i++);
      }
      function bar() {
        for(var i = 0; i < 100000000; i++);
      }
 
      function getPrefix() {
        var prefix = null;
        if (window.performance !== undefined) {
          if (window.performance.now !== undefined)
            prefix = "";
          else {
            var browserPrefixes = ["webkit","moz","ms","o"];
            // Test all vendor prefixes
            for(var i = 0; i < browserPrefixes.length; i++) {
              if (window.performance[browserPrefixes[i] + "Now"] != undefined) {
                prefix = browserPrefixes[i];
                break;
              }
            }
          }
        }
        return prefix;
      }
 
      function getTime() {
        return (prefix === "") ? window.performance.now() : window.performance[prefix + "Now"]();
      }
 
      function doBenchmark() {
        if (prefix === null)
          document.getElementById("log").innerHTML = "Your browser does not support High Resolution Time API";
        else {
          var startTime = getTime();
          foo();
          var test1 = getTime();
          bar();
          var test2 = getTime();
          document.getElementById("log").innerHTML += "Test1 time: " + (test1 - startTime) + "<br />";
          document.getElementById("log").innerHTML += "Test2 time: " + (test2 - test1) + "<br />";
        }
      }
      var prefix = getPrefix();
      window.onload = doBenchmark;
    </script>
  </head>
  <body>
    <p id="log"></p>
  </body>
</html>
```

## 结论
在这篇文章中，我展示了什么是 `High Resolution Time API`，以及如何使用它。正如我所提到的，它没有被广泛支持，所以你还需要等待一段时间才能准确测试 Web 应用程序。然而，正如你所看到的，该API非常简单，因为它就只有一个方法。因此，一旦浏览器全面支持，迁移到 `High Resolution Time` 的时间，迅速而没有痛苦。

## 参考链接

- [W3C High Resolution Time - REC - 2012.12.17][1]
- [High Resolution Time 支持性检测][2]
- [Discovering the High Resolution Time API][4]
- [JavaScript 标准参考教程（alpha）—— performance对象：高精度时间戳][5]


  
  [1]: http://www.w3.org/TR/hr-time/ "High Resolution Time W3C Recommendation 17 December 2012"
  [2]: http://caniuse.com/high-resolution-time
  [3]: http://www.w3.org/TR/navigation-timing/#performancetiming "W3C PerformanceTiming"
  [4]: http://www.sitepoint.com/discovering-the-high-resolution-time-api/
  [5]: http://javascript.ruanyifeng.com/bom/performance.html
  