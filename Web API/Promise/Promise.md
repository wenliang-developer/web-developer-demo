# [Promise][1]
[TOC]

## Motivation
考虑下面的问题：同步的读取文件并解析成 `JSON` 的 `JavaScript` 函数。这个函数简单而易读，但你并不想在大多数应用中使用它，因为它会发生阻塞。这意味着，但你从磁盘读取文件时(一个缓慢的操作)你不能做别的事。
```javascript
function readJSONSync(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}
```
为了是我们的应用程序高性能和可响应，我们需要让所有涉及 `IO` 的操作异步进行。要做到这一点最简单的方法是使用 `callback`。然而，一个天真的实现可能会出问题：
```javascript
function readJSON(filename, callback){
  fs.readFile(filename, 'utf8', function (err, res){
    if (err) return callback(err);
    callback(null, JSON.parse(res));
  });
}
```

 - 额外 **callback** 参数混淆了我们对什么是输入，什么返回值的想法。
 - 它不与所有的 control flow primitives(控制流语句) 一起工作。
 - 它不处理 **JSON.parse** 引发的错误。

我们需要 **JSON.parse** 抛出的错误，但我们也必须小心，不要处理 **callback** 抛出的错误。当我们做到这一切的时候，我们的错误处理代码一团糟：
```javascript
function readJSON(filename, callback){
  fs.readFile(filename, 'utf8', function (err, res){
    if (err) return callback(err);
    try {
      res = JSON.parse(res);
    } catch (ex) {
      return callback(ex);
    }
    callback(null, res);
  });
}
```
尽管这个错误处理代码一团糟，我们仍然留下了 **callback** 存在多余的参数的问题。`Promise` 帮助你资源的处理错误，并且没有 **callback** 参数，可以编写更干净的代码。

## What is a promise?
Promise 背后的核心思想是，一个 `Promise` 表示异步操作的结果。`Promise` 有三种不同的状态：

 - *pending*：`Promise` 的初始状态。
 - *fulfilled*：`Promise` 的这个状态表示操作成功的状态。
 - *rejected*：`Promise` 的这个状态表示操作失败。
 
一旦 `promise` 状态变为 `fulfilled` 或 `rejected`，这是不可改变的(也就是说，它不能再更改)。

## Constructing a promise
在所有 `APIs` 都返回 `promises`(它是比较罕见的，你需要手工构造)之前，我们需要一个方法来 `polyfill` 现有 `API`。例如：
```javascript
function readFile(filename, enc){
  return new Promise(function (fulfill, reject){
    fs.readFile(filename, enc, function (err, res){
      if (err) reject(err);
      else fulfill(res);
    });
  });
}
```
我们使用 **new Promise** 来构造 `promise`。我们给构造器一个工厂函数来完成实际的工作。该函数带有两个可立即调用的参数。第一个参数 `promise` 的 `fulfills`，第二个参数 `promise` 的 `rejects` 。一旦操作完成后，我们调用相应的方法。

## Awaiting a promise
为了使用一个 `promise`，我们必须以某种方式等待它 `fulfilled` 或 `rejected`。要做到这一点需要使用 **promise.done** (如果试图运行这些样例，请参阅本节末尾警告)。

考虑到这一点，我们很容易重写前面的 **readJSON** 方法来使用 `promises`：
```javascript
function readJSON(filename){
  return new Promise(function (fulfill, reject){
    readFile(filename, 'utf8').done(function (res){
      try {
        fulfill(JSON.parse(res));
      } catch (ex) {
        reject(ex);
      }
    }, reject);
  });
}
```
这仍然有很多错误处理代码(在未来的一节，我们将看到如何对其进行改进)，但它少了很多的容易出错的编写，我们再也不用传入一个奇怪的额外参数。

> **warning：非标准的**

> 需要注意的是 **promise.done** (在本节的示例中使用)尚未标准化。它被很多 `promise` 库所支持，虽然，无论是作为辅助教材和产品代码非常有用。我建议使用它时，导入以下 `polyfill` ([minified][2] / [unminified][3]) ：
> `<script src="https://www.promisejs.org/polyfills/promise-done-6.0.0.min.js"></script>`

## Transformation / Chaining
通过下面的例子，我们真正想做的是通过另一种操作转换 `promise`。在我们的例子中，第二个操作是同步的，但它可能很容易的一直异步操作。幸运的是，`promise`(完全标准化，`jQuery` 除外) 有一个方法转换 `promise` 和 链式操作。

简单的说，**.then** 跟 **.done** 就好像 **.map** 跟 **.forEach**。以另一种方式，使用 **.then** 每当你要对 `result` 做一些事情(即使这只是等待它完成)，而你不打算对 `result` 做任何操作，就使用 **.done**。

现在我们可以重写我们之前的例子，这看起来很简单：
```javascript
function readJSON(filename){
  return readFile(filename, 'utf8').then(function (res){
    return JSON.parse(res)
  })
}
```
由于 **JSON.parse** 只是一个简单的方法，我们可以重写它：
```javascript
function readJSON(filename){
  return readFile(filename, 'utf8').then(JSON.parse);
}
```
它非常接近于我们最开始的那个简单的同步示例。

## Implementations / Polyfills
`Promises` 在 `node.js` 和浏览器中非常有用。

### jQuery
这感觉好像是一个好的时机，可以提醒你 `jQuery` 的 `promise` 和通常所说的 `promise` 其实是完全不同的。`jQuery` 的 `promise` 的具有糟糕的 `API`，它可能会迷惑你。幸运的是，我们可以将其转换为一个非常简单的标准化的 `promise`，而不是使用 `jQuery` 那奇怪的 `promise`：
```javascript
var jQueryPromise = $.ajax('/data.json');
var realPromise = Promise.resolve(jQueryPromise);
//now just use `realPromise` however you like.
```
### Browser
`Promise` 目前只有非常少的浏览器能够支持它。好消息是，它非常容易 `polyfill` ([minified][2] / [unminified][3])：
```html
<script src="https://www.promisejs.org/polyfills/promise-6.0.0.min.js"></script>
```
目前没有浏览器支持 **Promise.prototype.done**，所以如果你想使用该方法，而你不包括上面的 `polyfill`，你必须至少包括该 `polyfill`([minified][7] / [unminified][8])：
```html
<script src="https://www.promisejs.org/polyfills/promise-done-6.0.0.min.js"></script>
```
### Node.js
`node.js` 中 `polyfill` 一般不被视为很好的做法。相反，你最好 `require` 你需要的库。

要安装 [promise][4] 运行：
```
npm install promise --save
```
然后你可以使用 `require` 将其加载到局部变量：
```javascript
var Promise = require('promise');
```
该 `promise` 库还提供了一些非常有用的扩展来与 `Node.js` 交互。
```javascript
var readFile = Promise.denodeify(require('fs').readFile);
// now `readFile` will return a promise rather than expecting a callback

function readJSON(filename, callback){
  // If a callback is provided, call it with error as the first argument
  // and result as the second argument, then return `undefined`.
  // If no callback is provided, just return the promise.
  return readFile(filename, 'utf8').then(JSON.parse).nodeify(callback);
}
```

## Further Reading
[Patterns][5] —— promise 使用的模式，引入大量的辅助方法，将节省你的时间。
[MDN][6] —— Mozilla 开发网站很多 promise 的文档。


[**Patterns→**][5]

[1]: https://www.promisejs.org/
[2]: https://www.promisejs.org/polyfills/promise-6.0.0.min.js "promise minified polyfill"
[3]: https://www.promisejs.org/polyfills/promise-6.0.0.min.js "promise unminified polyfill"
[4]: https://github.com/then/promise "node.js promise"
[5]: https://www.promisejs.org/patterns/ "Patterns"
[6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise "MDN"
[7]: https://www.promisejs.org/polyfills/promise-done-6.0.0.min.js "promise done minified polyfill"
[8]: https://www.promisejs.org/polyfills/promise-done-6.0.0.js "promise done unminified polyfill"

  
 