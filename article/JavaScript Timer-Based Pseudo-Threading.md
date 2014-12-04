# [JavaScript Timer-Based Pseudo-Threading][1] (译文)

在我以前的帖子，[JavaScript Execution and Browser Limits][2]，我描述了前五的浏览器是如何确定什么时候 JavaScript 代码运行的时间过长，并抛出 "unresponsive script" error。改变浏览器的行为不切实际，并且不可能总是能够将任务转移到服务器上处理。幸运的是，timers 可以帮助我们执行长时间运行的任务，而不锁定浏览器。

## What are timers?
JavaScript 代码，如果是一个独立的函数，可以设定经过特定的时间段后运行：

 - **setTimeout(function, msec[, arg1 ... argN])**
    在 `msec` 毫秒之后运行指定的 `function`。如果有参数，将传递给 `function`。
 - **setInterval(function, msec[, arg1 ... argN])**
    类似于 setTimeout 除了函数每 msec 毫秒，无限期的调用。

另外两个函数，clearTimeout() 和 clearInterval()，将取消 timer 操作，例如：
```javascript
var timerID = setTimeout(myfunction, 500);
clearTimeout(timerID); // myfunction() will never be called
```
> Note:
setTimeout 和 setInterval 传递引用的函数(没有括号)。代码 `setTimeout(myfunction(), 500);` 将立即运行 myfunction()。
毫秒计时时间很少会准确。它们仅仅指定当浏览器经过特定时间如果空闲将运行函数。
不要依赖运行定时器的顺序。如 `setTimeout(f1, 50); setTimeout(f2, 50);` —— f2 会首先执行。

## Timer-based execution
timer 不是立即运行，所以浏览器处理线程被释放以执行其他任务。因此，我们可以将很长的处理拆分成小块。

作为一个简单的例子，假设我们要顺序运行函数 f1()，f2()，f3()：
```javascript
function ProcessThread(func) {
	var ms = 20;
	setTimeout(function() {
		func.shift()();
		if (func) {
			setTimeout(arguments.callee, ms);
		}
	}, ms);
}

ProcessThread([f1, f2, f3]);
```

> Note:func.shift()?!
这需要进一步说明；func.shift() 删除数组中的第一项，并返回它。这里是一个引用的函数，所以我们增加括号来执行它。
该语句的功能等同于 `var f = func.shift();f();`

ProcessThread  Array 中的所有函数，每次等待 20ms。任何数量的函数，可以按顺序执行 ...... 假设没有单独的函数抛出 "unresponsive script" error。

然而最耗时的代码可能处理大型数组中的数据。在我的下一篇文章中，我们将书写更健壮的代码来处理该类型的操作。


  [1]: http://www.sitepoint.com/javascript-timer-pseudo-threading/
  [2]: http://www.sitepoint.com/javascript-execution-browser-limits/
  
 