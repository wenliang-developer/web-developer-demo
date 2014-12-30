# Geolocation API
[TOC]

## support:
browser      | version
---------    | -----
Chrome | 15+
IE (limited) | 11+
Firefox | 10+
Chrome for Android | 39+
iOS Safari | NO
Android Browser | NO
UC Browser for Android | NO
Opera Mini | NO
Safari | 5.1+
Opera | 12.1+
IE Mobile (limited) | 11+
Firefox for Android | 33+

Fullscreen 定义了 web 平台上的 fullscreen API。

所有的 documents 都有一个 fullscreen enabled flag 和 fullscreen element stack。除非另有说明 fullscreen enabled flag 没有设置，fullscreen element stack 为空。

## API
```IDL
partial interface Element {
  void requestFullscreen();
};

partial interface Document {
  readonly attribute boolean fullscreenEnabled;
  readonly attribute Element? fullscreenElement;

  void exitFullscreen();
};
```
> ***element* . requestFullscreen()**
>> 将 *element* 显示全屏

> ***document* . fullscreenEnabled**
>> 如果 *document* 有显示 element 全屏的能力则返回 true，否则返回 false。

> ***document* . fullscreenElement**
>> 返回全屏显示的 element，如果没有返回 null。

> ***document* . exitFullscreen()**
>> 停止 *document* 内部所有元素的全屏显示。



## 参考链接

- [W3C Fullscreen API Specification][1]
- [Full Screen API 浏览器支持情况][2]



  [1]: http://www.w3.org/TR/2012/WD-fullscreen-20120703/ "W3C"
  [2]: http://caniuse.com/fullscreen "caniuse"