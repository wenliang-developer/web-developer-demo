# [Implementing][1]
[TOC]

## Introduction
本文取自于文章 [Stack Overflow][2] 的答复。希望通过观察，如何用 `JavaScript` 实现 **Promise**，你可以更好的理解 `promise` 的行为。
## State Machine
因为一个 `promise` 只是一个 `state machine`，我们应该从 `state` 信息开始考虑。
```javascript
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise() {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value or error once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers attached by calling .then or .done
  var handlers = [];
}
```
## Transitions
接下来，让我们考虑可能发生的两个重要的 `tansitions`，`fulfilling` 和 `rejecting`：
```javascript
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise() {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
  }
}
```
这为我们提供了基本的较低水平的 `transitions`，当然让我们考虑一个额外的，更高层次的 `transition` 称为 **resolve**。
```javascript
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise() {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
  }

  function resolve(result) {
    try {
      var then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject)
        return
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }
}
```
注意 **resolve** 如何接受一个 `promise` 或普通值，如果它是一个 `promise`，等待它完成。一个 `promise` 绝对不能让另一个 `promise` 来 `fulfilled` 它。因此我们将暴露 **resolve** 方法，而不是内部的 **fulfill**。我们已经使用了几个辅助方法，所以让我们来定义它们：
```javascript
/**
 * Check if a value is a Promise and, if it is,
 * return the `then` method of that promise.
 *
 * @param {Promise|Any} value
 * @return {Function|Null}
 */
function getThen(value) {
  var t = typeof value;
  if (value && (t === 'object' || t === 'function')) {
    var then = value.then;
    if (typeof then === 'function') {
      return then;
    }
  }
  return null;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 *
 * @param {Function} fn A resolver function that may not be trusted
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}
```
## Constructing
现在我们有了完整的 `internal state machine`(内部状态机)，但我们还没有暴露 `resolving the promise`(解决promise) 的任何方法或观察它。让我们从添加 `resolving the promise` 开始。
```javascript
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn) {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
  }

  function resolve(result) {
    try {
      var then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject)
        return
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }

  doResolve(fn, resolve, reject);
}
```
正如你所看到的，我们重新利用 **doResolve**，因为我们有一个不可信的解析程序。`fn` 允许调用成为 `resolve` 和 `reject` 多次，甚至抛出异常。它由我们来确保 `promise` 只 `resolved` 或 `rejected` 一次，然后再也不会转换到不同的状态。

## Observing (via .done)
我们现在有了一个完整的 `state machine`，但我们仍然没有办法来观察任何更改。我们的最终目的是实现 **.then**，但 .done 的语义要简单的多让我们先的语义要简单的多让我们想实现它 实现它。

我们的目标是实现 **promise.done(*onFulfilled*, *onRejected*)**，使得：

 - 仅调用 *onFulfilled* 或 *onRejected* 中的一个。
 - 它只调用一次。
 - 它永远不会调用直到下一个 `tick` (即在 **.done** 方法返回后)。
 - 我们调用 **.done**，无论之前或之后 `promise` 是否得到解决。

```javascript
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn) {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
    handlers.forEach(handle);
    handlers = null;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
    handlers.forEach(handle);
    handlers = null;
  }

  function resolve(result) {
    try {
      var then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject)
        return
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }

  function handle(handler) {
    if (state === PENDING) {
      handlers.push(handler);
    } else {
      if (state === FULFILLED &&
        typeof handler.onFulfilled === 'function') {
        handler.onFulfilled(value);
      }
      if (state === REJECTED &&
        typeof handler.onRejected === 'function') {
        handler.onRejected(value);
      }
    }
  }

  this.done = function (onFulfilled, onRejected) {
    // ensure we are always asynchronous
    setTimeout(function () {
      handle({
        onFulfilled: onFulfilled,
        onRejected: onRejected
      });
    }, 0);
  }

  doResolve(fn, resolve, reject);
}
```
我们一定要在 `Promise` 已经 `resolved` 或 `rejected` 时通知 `handlers`。我永远只能在下一次 `tick` 这样做。

## Observing (via .then)
现在我们已经实现了 **.done**，只需要做同样的事情，就可以轻松实现 **.then**，但在这个过程中需要建立新的 `Promise`。
```javascript
this.then = function (onFulfilled, onRejected) {
  var self = this;
  return new Promise(function (resolve, reject) {
    return self.done(function (result) {
      if (typeof onFulfilled === 'function') {
        try {
          return resolve(onFulfilled(result));
        } catch (ex) {
          return reject(ex);
        }
      } else {
        return resolve(result);
      }
    }, function (error) {
      if (typeof onRejected === 'function') {
        try {
          return resolve(onRejected(error));
        } catch (ex) {
          return reject(ex);
        }
      } else {
        return reject(error);
      }
    });
  });
}
```
## Further Reading

 - [then/promise][3] —— 在 `JavaScript` 中所有这些辅助方法的实现。
 - [kriskowal/q][4] —— 是一种 `promise` 的非常不同的实现，并配有它背后的设计原则，是一个非常好的演练。
 - [Stack Overflow][2] ——　就是这篇文章的原始出处。

       
[**←Generators**][5]

[1]: https://www.promisejs.org/implementing/
[2]: http://stackoverflow.com/questions/23772801/basic-javascript-promise-implementation-attempt/23785244#23785244
[3]: https://github.com/then/promise/blob/master/core.js
[4]: https://github.com/kriskowal/q/blob/v1/design/README.js
[5]: https://www.promisejs.org/generators/

  
 