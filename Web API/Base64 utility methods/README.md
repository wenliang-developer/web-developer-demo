# Base64 encoding and decoding (Base64 编码和解码)
[TOC]

atob() 和 btoa() 方法允许我们对 base64 编码和解码。

## JavaScript 是如何实现的？
### WindowBase64 interface
```
[NoInterfaceObject, Exposed=(Window,Worker)]
interface WindowBase64 {
  DOMString btoa(DOMString btoa);
  DOMString atob(DOMString atob);
};
Window implements WindowBase64;
```
> **Note:** 这个 API 有一个助记法： “`b`” 可以被认为是代表 “`binary`(二进制)”，而 “`a`” 这代表 “`ASCII`”。在实践中，出于历史原因，这些函数的输入和输出都是 `Unicode` 字符串。

## API 介绍
### *result = window . btoa( data )*
data 参数是一个范围在 U +0000 ~ U +00FF 的 Unicode 的字符串。返回对应二进制字节，范围在 0x00 ~ 0xFF 之间。

如果输入字符串包含任何超出范围的字符，则抛出 InvalidCharacterError。

### *result = window . atob( data )*
data 包含 

## 参考链接

- [HTML5: Battery Status API][1]
- [Battery Stats API 浏览器支持性][2]
- [Battery Status API - W3C WD - 2014.08.28][W3C WD]
- [Battery Status API - W3C CR - 2014.05.08][W3C CR]
- [MDN Battery Status API][3]



  [1]: http://code.tutsplus.com/tutorials/html5-battery-status-api--mobile-22795
  [2]: http://caniuse.com/battery-status "caniuse"
  [3]: https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API "MDN Battery Status API"
  [W3C CR]: http://www.w3.org/TR/2012/CR-battery-status-20120508/ "Battery Status API W3C Candidate Recommendation 08 May 2012"
  [W3C WD]: http://www.w3.org/TR/battery-status/ "Battery Status API W3C Last Call Working Draft 28 August 2014"