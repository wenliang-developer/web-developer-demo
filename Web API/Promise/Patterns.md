# [Patterns][1]
[TOC]

我们已经看到了，甚至只是做两个简单的操作，当陆续考虑异步代码的错误处理时，它会变得及其复杂。我们也看到了`promise` 是如何帮助你透过 **.then**，使错误的堆栈在默认情况下得到减轻的。

在本文中，我们将介绍一些更高级的模式供 promise 使用和一些辅助方法，让你的 promise 代码更简洁。

## Promise.resolve(value)
有些时候，你已经有了一个值，你先把它转换成一个 promise。你可能有时会发现自己与一个值，可能会或可能不会是一个 promise。最后，你可能会发现你有一个值，是一种 promise，但它不能正常工作，并希望将其转换成一个真正的 promise。
```javascript
var value = 10;
var promiseForValue = Promise.resolve(value);
// equivalent to
var promiseForValue = new Promise(function (fulfill) {
  fulfill(value);
});
```
```javascript
var jQueryPromise = $.ajax('/ajax-endpoint');
var realPromise = Promise.resolve(jQueryPromise);
// equivalent to
var realPromise = new Promise(function (fulfill, reject) {
  jQueryPromise.then(fulfill, reject);
});
```
```javascript
var maybePromise = Math.random() > 0.5 ? 10 : Promise.resolve(10);
var definitelyPromise = Promise.resolve(maybePromise);
// equivalent to
var definitelyPromise = new Promise(function (fulfill, reject) {
  if (isPromise(maybePromise)) {
    maybePromise.then(fulfill, reject);
  } else {
    fulfill(maybePromise);
  }
});
```

## Promise.reject
这是最好的总是避免在一个异步方法中抛出同步异常的方法。总是返回一个 promise，可以以一致的方式处理所有的错误。为了更容易做到这一点，有一个生成 rejected promise 的快捷方式。
```javascript
var rejectedPromise = Promise.reject(new Error('Whatever'));
// equivalent to
var rejectedPromise = new Promise(function (fulfill, reject) {
  reject(new Error('Whatever'));
});
```

## Parallel operations
尝试并行会使问题更加复杂。考虑下面的函数，它试图读取文件的数组(参考 filename)，并分析它们的 JSON 然后通过 callback 返回结果数组。
```javascript
function readJsonFiles(filenames, callback) {
  var pending = filenames.length;
  var called = false;
  var results = [];
  if (pending === 0) {
    // we need to return early in the case where there
    // are no files to read, but we must not return immediately
    // because that unleashes "Zalgo". This makes code very hard
    // to reason about as the order becomes increasingly
    // non-deterministic.
    return setTimeout(function () { callback(); }, 0);
  }
  filenames.forEach(function (filename, index) {
    readJSON(filename, function (err, res) {
      if (err) {
        if (!called) callback(err);
        return;
      }
      results[index] = res;
      if (0 === --pending) {
        callback(null, res);
      }
    });
  });
}
```
## Promise.all
all 函数返回一个新的 promise。状态为 fulfilled 时具有传递给 promises 的 fulfillment 值的数组，或 rejects 是某种原因第一个 rejects 的 promises。
```javascript
function readJsonFiles(filenames) {
  // N.B. passing readJSON as a function, not calling it with `()`
  return Promise.all(filenames.map(readJSON));
}
readJsonFiles(['a.json', 'b.json']).done(function (results) {
  // results is an array of the values stored in a.json and b.json
}, function (err) {
  // If any of the files fails to be read, err is the first error
});
```
Promise.all 是一种内置的方法，所以你不必担心需要自己实现它，但它作为对 promise 如何轻松工作的一个很好的演示。
```javascript
function all(promises) {
  var accumulator = [];
  var ready = Promise.resolve(null);

  promises.forEach(function (promise) {
    ready = ready.then(function () {
      return promise;
    }).then(function (value) {
      accumulator.push(value);
    });
  });

  return ready.then(function () { return accumulator; });
}
```
这是怎么回事，我们首先创建一个变量来存储结果(被称为 accumulator)和一个变量来表示结果时候是最新的(称为 ready)。我们等待 ready，而它具有每轮更新的循环。这导致我们按顺序将每一次循环的 value 追加到 数组。通过在循环的结尾，ready 是将等待所有项目被插入到 accumulator 的 promise。

我们要做的是等待 ready promise，返回 accumulator。
## Promise.race
有时候让两个 promise 相互比赛非常有用。考虑写 timeout 功能的情况。你可以这样做：
```javascript
function delay(time) {
  return new Promise(function (fulfill) {
    setTimeout(fulfill, time);
  });
}
function timeout(promise, time) {
  return new Promise(function (fulfill, reject) {
    // race promise against delay
    promise.then(fulfill, reject);
    delay(time).done(function () {
      reject(new Error('Operation timed out'));
    });
  });
}
```
Promise.race 使得比赛很容易运行：
```javascript
function timeout(promise, time) {
  return Promise.race([promise, delay(time).then(function () {
    throw new Error('Operation timed out');
  })]);
}
```
以首先赢得比赛的 promise(fulfills 或 rejects)为准，并确定返回结果。

[**Patterns→**][5]

[1]: https://www.promisejs.org/patterns/
[2]: https://www.promisejs.org/polyfills/promise-6.0.0.min.js "promise minified polyfill"
[3]: https://www.promisejs.org/polyfills/promise-6.0.0.min.js "promise unminified polyfill"
[4]: https://github.com/then/promise "node.js promise"
[5]: https://www.promisejs.org/patterns/ "Patterns"
[6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise "MDN"
[7]: https://www.promisejs.org/polyfills/promise-done-6.0.0.min.js "promise done minified polyfill"
[8]: https://www.promisejs.org/polyfills/promise-done-6.0.0.js "promise done unminified polyfill"

  
 