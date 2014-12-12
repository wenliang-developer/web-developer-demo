# [Hashchange event][1]
[TOC]

hashchange 事件在当前页面 URL 的 hash 值发生改变时触发(例如：page.html#foo 到 page.html#bar)。

## The HashChangeEvent interface
```IDL
[Constructor(DOMString type, optional HashChangeEventInit eventInitDict), Exposed=(Window,Worker)]
interface HashChangeEvent : Event {
  readonly attribute DOMString oldURL;
  readonly attribute DOMString newURL;
};

dictionary HashChangeEventInit : EventInit {
  DOMString oldURL;
  DOMString newURL;
};
```
> NOTE:  
*event*.oldURL —— 返回以前的 session history entry(会话历史记录) 的当前 URL。
*event*.newURL —— 返回现在的 session history entry 的当前 URL。

## 使用
```javascript
window.onhashchange = funcRef;
```
或者
```html
<body onhashchange="funcRef();">
```
再或
```javascript
window.addEventListener("hashchange", funcRef, false);
```

完整的示例：
```javascript
if ("onhashchange" in window) {
    alert("该浏览器支持hashchange事件!");
}

function locationHashChanged() {
    if (location.hash === "#somecoolfeature") {
        somecoolfeature();
    }
}

window.onhashchange = locationHashChanged;
```



[1]: https://html.spec.whatwg.org/multipage/browsers.html#the-hashchangeevent-interface "WhatWG"


  
 