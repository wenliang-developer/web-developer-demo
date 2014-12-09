# [Generators][1]
[TOC]

## Introduction
在 `ES6` 推出的最令人兴奋的功能之一就是 `Generators`。它们的主要用例就是表示 `lazy sequences`(可能无限的)。例如，下面的函数返回 `0~n` 的 正整数。
```javascript
function count(n){
  var res = []
  for (var x = 0; x < n; x++) {
    res.push(x)
  }
  return res
}

for (var x of count(5)) {
  console.log(x)
}
```
我们可以使用 `generatos` 编写相似的方法，返回所有的正整数。
```javascript
function* count(){
  for (var x = 0; true; x++) {
    yield x
  }
}

for (var x of count()) {
  console.log(x)
}
```
这是怎么回事，**count()** 函数正在懒洋洋的计算，所以 它在每一次 **yield** 之后暂停并等待要求另一个值的提供。这意味着 `for/of loop` 将永远执行，不断得到无限列表的下一个整数。

究其原因这是多么让人激动，我们可以利用暂停功能，以帮助我们编写异步代码的能力。具体来说，我们将用来做现有控制流结构里面异步的东西，比如循环，条件和 `try/catch` 块。

`generators` 不就是代表异步操作的结果的一种方式。为此，我们需要一个 `promise`。

这篇文章的目的是教你能够写这样的代码：
```javascript
var login = async(function* (username, password, session) {
  var user = yield getUser(username);
  var hash = yield crypto.hashAsync(password + user.salt);
  if (user.hash !== hash) {
    throw new Error('Incorrect password');
  }
  session.setUser(user);
});
```
此处的代码读取就好像它在同步执行一样，但实际上是在各 **yield** 关键字间异步工作。调用 **login** 登陆方法的结果将是一个 `promise`。

## How it works - Fulfilling
正如你在简介中所看到的，我们可以停下来等待使用 **yield** 关键字的 `promise`。我们现在需要的是一种方式获得更好的控制该 `generator` 的方法，一旦 `promise` 完成，以便让它再次启动。幸运的是，这是有可能的。通过 `generator` 的 **.next** 方法。
```javascript
function* demo() {
  var res = yield 10;
  assert(res === 32);
  return 42;
}

var d = demo();
var resA = d.next();
// => {value: 10, done: false}
var resB = d.next(32);
// => {value: 42, done: true}
//if we call d.next() again it throws an error
```
这里发生了什么，我们第一次调用 **d.next()** 得到 **yield** 的结果，然后当我们调用 **d.next()** 第二次，我们给它的值是 **yield** 表达式的结果。然后该函数可以移动到 **return** 语句返回一个最终结果。

我们可以利用这一点，通过调用 **.next(result)** 以表示 `promise` 已经 `fulfilled` 了结果。

## How it works - Rejecting
我们需要一种方式来表示一个已经 `yield` 被 `rejected` 的 `promise`。我们使用 **.thorw(error)** 方法来使 `generator` 做到这一点。
```javascript
var sentinel = new Error('foo');
function* demo() {
  try {
    yield 10;
  } catch (ex) {
    assert(ex === sentinel);
  }
}

var d = demo();
d.next();
// => {value: 10, done: false}
d.throw(sentinel);
```
像以前一样，我们调用 **d.next()** 来取得第一个 **yield** 关键字。然后，我们可以使用 **d.throw(error)**，这将使 `generator` 处理 **yield** 抛出的错误。在我们的例子中，这将触发 **catch** 块。

## How it works - Putting it all together
把所有这一切放在一切，我们只需要手动移动 `generator` 的 `yield`。我们可以使用这样一个简单的功能：
```javascript
function async(makeGenerator){
  return function () {
    var generator = makeGenerator.apply(this, arguments);

    function handle(result){
      // result => { done: [Boolean], value: [Object] }
      if (result.done) return Promise.resolve(result.value);

      return Promise.resolve(result.value).then(function (res){
        return handle(generator.next(res));
      }, function (err){
        return handle(generator.throw(err));
      });
    }

    try {
      return handle(generator.next());
    } catch (ex) {
      return Promise.reject(ex);
    }
  }
}
```
请注意我们如何使用 **Promise.resolve**，以确保我们总是处理 `promise`，我们使用 `Promise.reject` 和 `try/catch` 块，以确保同步错误总是转换成异步错误。

## Further Reading

 - [MDN][2] —— `mozilla` 开发者网站中关于 `generator` 的文档。
 - [MDN][3] —— `mozilla` 开发者网站有许多 `promise` 的文档。
 - [regenerator][4] ——　通过 `Facebook` 的一个项目同价交叉编译的代码对旧环境加入 `generator` 支持。
 - [gnode][5] —— 命令行的一个应用，使用 `regenerator` 在旧版本的 `node.js` 中支持 `generator`。
 - [then-yield][6] —— 该库提供编写使用 `generators` 实现 `promise` 的代码。
 - [Task.js][7] —— 另一个库让 `generators` 具有 `promise` 功能。


[**←Patterns**][8]           
[**implementing →**][9]

[1]: https://www.promisejs.org/generators/
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise "MDN"
[4]: http://facebook.github.io/regenerator/
[5]: https://github.com/then/promise/blob/master/index.js
[6]: https://github.com/then/yield
[7]: http://taskjs.org/
[8]: https://www.promisejs.org/patterns/
[9]: https://www.promisejs.org/implementing/

  
 