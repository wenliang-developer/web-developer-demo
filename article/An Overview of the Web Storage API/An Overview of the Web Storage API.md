# [An Overview of the Web Storage API][1] (译文)
[TOC]

`Web` 开发人员一直渴望有一种方式来持久化存储数据。`Cookie` 是一种选择，但他们只能存储 `4KB` 的数据。此外，每个 `HTTP` 请求都会将 `Cookie` 发送到服务器。这意味着，`Cookie` ，尤其是大的，会消耗大量的网络带宽。已经出现过其他尝试来实现存储技术，但大多数只是 `hacks`。随后，有出现了 `HTML5` 和 [Web Storage API][2] 来营救。

`Web Storage API` 定义了两种类型的 `storage area` —— **local storage** 和 **session storage**。`local storage` 直到它被显式删除或者直到浏览器清空缓存。根据该规范，浏览器应至少为每个 `domain` 分配 `5MB` 的 `local storage`。第二种存储类型，`session storage`，也是持久化数据，但是数据绑定到一个 **top-level brosing context** (即一个浏览器 tag 或 window)。`session storage` 直到被删除或该 `browser context` 被关闭会一直保存。`session storage` 是非常有用的，当用户使用同一个网站的多个实例进行交互。在这种情况下，用 `local storage` 可能会导致不同的实例覆盖其他数据。

这两种类型的存储区域是通过 **global** 对象的名为 **localStorage** 和 **sessionStorage** 属性访问的。两个 `Storage area` 实现与完全一样的 `API`。数据存储为 `key/value pairs`，并且所有的数据以字符串形式存储。当添加存储的数据，它会隐私转换为字符串。然而，当该字符串数据从存储器中检索出来，需要使用函数来显式转换为适当的数据类型，如 `parseInt()`。当与对象打交道时，应该使用 `JSON.parse()` 和 `JSON.stringify()` 来序列化和反序列化。

## Detecting Storage Support
像许多其他 `HTML5` 一样，`Web Storage API` 并非所有浏览器都支持。要检查浏览器是否支持 `storage`，使用如下所示的函数。函数检查 `global.localStorage` 对象是否存在。可以创建一个类似的函数，以检查 `session storage`，如果 `storage area` 存在，则返回它，否则返回 `false`。
```javascript
function localStorageSupported() {
 try {
  return "localStorage" in window && window["localStorage"] !== null;
 } catch (e) {
  return false;
 }
}
```
## Storing Data
使用 `setItem()` 方法将数据加入到 `storage`。`setItem()` 需要一个 *key* 和 *value* 作为参数。如果该 *key* 在 `storage` 中不存在，那么添加 `key/value pairs`。如果该 *key* 已存在，则该 `value` 被更新。`setItem()` 的用例如下。该示例显示了如何将不同类型的数据添加到 `local storage` 和 `session storage`。请注意， *key* 参数必须始终是一个字符串，而 *value* 的类型可能有所不同。
```javascript
localStorage.setItem("key", "value");
sessionStorage.setItem("foo", 3.14);
localStorage.setItem("bar", true);
sessionStorage.setItem("baz", JSON.stringify(object));
```
数据也可以使用对对象的属性赋值添加来到 `storage`。上面的 `setItem()` 的例子被重写为下面的使用赋值语句的例子。请注意，分配给第一行的 `key` 将静默失败。这是因为在 `storage area` 有一个内置的函数明 `key()`(稍后进行简介)。出于这个原因，所述 `API` 方法是用来访问 `storage` 的首选方式。
```javascript
localStorage.key = "value"; // this fails silently
sessionStorage.foo = 3.14;
localStorage["bar"] = true;
sessionStorage["baz"] = JSON.stringify(object);
```
如果一个 `site` 尝试存储太多的数据，最终浏览器的存储配额被突破并且会抛出异常。为了处理这种情况，存储数据时应该使用 `try-catch block`。这样的一个例子如下所示：
```javascript
try {
 localStorage.setItem("key", "value");
} catch (e) {
 alert("Exceeded Storage Quota!");
}
```
## Reading Stored Data
读取存储的数据，使用 `getItem()` 方法。`getItem()` 时需要一个查找 *key* 作为唯一的参数。如果 *key* 存在于 `storage`，则相应的 `value` 被返回。如果该 *key* 不存在，则返回 `null`。下面的示例使用 `getItem()` 方法检索之前例子中使用 `setItem()` 方法存储的数据。
```javascript
var string = localStorage.getItem("key");
var number = sessionStorage.getItem("foo");
var boolean = localStorage.getItem("bar");
var object = JSON.parse(sessionStorage.getItem("baz"));
```
存储的数据，也可以通过读取 `localStorage` 和 `sessionStorage` 对象的属性进行访问，上一个 `getItem()` 的例子被重写为使用对象属性的语法：
```javascript
var string = localStorage.key;
var number = sessionStorage.foo;
var boolean = localStorage["bar"];
var object = JSON.parse(sessionStorage["baz"]);
```
## Iterating Over Stored Data
很多时候，有必要通过编程以循环的形式获取 `storage` 中的所有 `item`。循环的上限有特定 `storage area` 的 **length** 属性来确定。所有存储的 **key** 可以使用 `key()` 方法检索。`key()` 仅使用一个整数参数，作为一个 `storage area` 中的索引。循环 `localStorage` 的每个 `key/value pairs` 的例子如下所示。当然 `session storage` 也以类型的方式进行处理。
```javascript
for (var i = 0; i < localStorage.length; i++) {
 var key = localStorage.key(i);
 var value = localStorage.getItem(key);

 // do something with the key and value
}
```
## Deleting Stored Data
当不再需要数据，应当明确的移除。这对于 `localStorage` 更是如此，因为在浏览器关闭后它也会一直存在。从 `storage` 中删除 `key/value pairs`，可以使用 `removeItem()` 方法。该 `removeItem()` 方法使用 *key* 这个唯一的参数来删除数据。如果该 *key* 不存在，那么什么都不会发生。`removeItem()` 方法的实例如下所示：
```javascript
localStorage.removeItem("key");
sessionStorage.removeItem("foo");
localStorage.removeItem("bar");
sessionStorage.removeItem("baz");
```
**delete** 操作符还可以用于移除 `storage` 的数据。将前面的例子改写为使用 `delete` 移除 `key/value pairs`。
```javascript
delete localStorage.key;
delete sessionStorage.foo;
delete localStorage["bar"];
delete sessionStorage["baz"];
```
`removeItem()` 用于删除单个数据段，`clear()` 方法用于删除所有存储的数据。`clear()` 的用法如下：
```javascript
localStorage.clear();
sessionStorage.clear();
```
## The storage Event
用户可能在任何给定的时间打开相同 `site` 的多个实例。需要在一个 `storage area` 的一个实例进行了更改，能够反映到其他实例。`Web Storage API` 使用 **storage** `event` 来完成。当一个 `storage area` 被改变时，一个 **storage** `event` 将在任何共享这个 `storage area` 的任何其他 `tag/window` 中触发。请注意，`storage event` 不会在发生 `storage area` 的 `tag/window` 中触发。

`storage area` 可以通过 `setItem()`，`removeItem()` 和 `clear()` 来进行修改。然而，并非调用这些方法就一定会让 `storage area` 发生改变。例如，调用 `clear()` 清空 `storage area` 或 `removeItem()` 删除指定 *key* 的数据，如果没有相应的数据，`storage area` 不会发生改变并且也不会触发 **storage** 事件。

下面描述了 **storage** `event` 对象具有的一些有用的字段。紧跟着相关字段的描述之后，就是一个 **storage** 事件处理程序的例子。

 - **key** —— 此字段是 `setItem()` 和 `removeItem()` 的参数，或者为 `null` 时，表明是调用 `clear()` 触发的事件。
 - **newValue** —— setItem() 方法的 *value* 参数。嗲用 `removeItem()` 和 `clear()` 时该字段为 `null`。
 - **oldValue** —— 此字段为调用 `setItem()` 和 `removeItem()` 的之前的值。调用 `clear()` 该字段为 `null`。
 - **url** —— 表示其受到影响的 `storage area` 的页面的地址。
 - **storageArea** —— 对应更改的 `local storage` 或 `session storage`。

```javascript
window.addEventListener("storage", function(event) {
 var key = event.key;
 var newValue = event.newValue;
 var oldValue = event.oldValue;
 var url = event.url;
 var storageArea = event.storageArea;

 // handle the event
});
```

## Example Page
下面的代码是对 `local storage` 进行操作的 `demo page`。查看该页面可点击[这里](storage.html)。这个例子覆盖了整个 `local storage API`，其中包括 **storage** `event`。为了看到 **storage** `event`，页面必须在同一个浏览器中至少两个独立的 tag/window 中打开。**storage** `event` 需要一个提供 `HTTP` 的服务器才能工作(即 `file://protocol` 无法正常工作)。
```html
<!DOCTYPE html>
<html>
<head>
 <title>Web Storage Example</title>
 <meta charset="UTF-8" />
 <script>
  "use strict";
  window.addEventListener("load", function(event) {
   var key = document.getElementById("key");
   var value = document.getElementById("value");
   var add = document.getElementById("add");
      var remove = document.getElementById("remove");
      var clear = document.getElementById("clear");
      var content = document.getElementById("content");

   add.addEventListener("click", function(event) {
        if (key.value !== "") {
     try {
           localStorage.setItem(key.value, value.value);
     } catch (e) {
      alert("Exceeded Storage Quota!");
     }
          refreshContents();
        }
      });

      remove.addEventListener("click", function(event) {
        if (key.value !== "") {
          localStorage.removeItem(key.value);
          refreshContents();
        }
      });

      clear.addEventListener("click", function(event) {
        localStorage.clear();
        refreshContents();
      });

      window.addEventListener("storage", function(event) {
        var k = event.key;
        var newValue = event.newValue;
        var oldValue = event.oldValue;
        var url = event.url;
        var storageArea = event.storageArea;

        alert("EVENT:n" + k + "n" + newValue + "n" + oldValue + "n" + url + "n" + storageArea);
        refreshContents();
      });

      function refreshContents() {
        var str = "";

        for (var i = 0, len = localStorage.length; i < len; i++) {
          var k = localStorage.key(i);
          var v = localStorage.getItem(k);

          str += "'" + k + "' = '" + v + "'<br />";
        }

    key.value = "";
    value.value = "";
        content.innerHTML = str;
      }

      refreshContents();
    });
  </script>
</head>
<body>
  Key:  <input type="text" id="key" /><br />
  Value: <input type="text" id="value" /><br />
  <input type="button" id="add" value="Add to Storage" />&nbsp;
  <input type="button" id="remove" value="Remove from Storage" />&nbsp;
  <input type="button" id="clear" value="Clear Storage" /><br />
  Contents of Local Storage:<br />
  <span id="content"></span>
</body>
</html>
```

## Things to Remember(需要记住)

 - `local storage` 会一直存在，直到被明确删除或浏览器的缓存清空。
 - `session storage` 会一直存在，直到它被显式删除或 `browser context` 被关闭。
 - 由一个浏览器存储的数据不会被其他浏览器访问。例如，`Chrome` 浏览器存储的数据在 `Firefox` 浏览器中无法访问。
 - `Object` 应被存储为 `JSON` 字符串。
 - 出于安全原因，敏感数据不应该被保存，特别是 `local storage`。
 - 更改 `storage area` 导致 **storage** `event` 被触发。
 - 与其他许多 `HTML5` 功能一样，`Web Storage` 尚未统一实现。


 


[1]: http://www.sitepoint.com/an-overview-of-the-web-storage-api/
[2]: http://www.w3.org/TR/webstorage/ "Web Storage W3C Recommendation 30 July 2013"


  
 