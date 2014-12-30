# [How to Use the HTML5 Full-Screen API (Again)][1](译文)
[TOC]

## What is the Full-Screen API?
该 API 运行一个单一的元素 full-screen 查看。不同于按 F11 你的浏览器强制 full-screen。该 API 面向 images，videos 和 一个容器内运行的 game。当你进入 full-screen mode，一个消息会通知用户按 ESC 键随时返回页面。

[Full-Screen API][4] 得到现在所有最新的 desktop browser，包括 IE11 支持。mobile 的支持很少，当这些浏览器通常运行在一个几乎 full-screen view 下。不幸的是，它们有细微的差别，需要前缀，已解决跨浏览器的不一致...

## The JavaScript API
假设我们有一个 ID 为 **`myimage`** 的图片，我们要在 full-screen view 下查看它。主要的方法和属性是：

### **document.fullscreenEnabled** *(changed)*
当 document 允许 full-screen 模式的状态，此属性返回 true。它可以被用来确定浏览器的支持：
```javascript 
if (document.fullscreenEnabled) { ... }
```
早期的实现有一个大写 "S" 的 "Screen"，你仍然需要为 Firefox 添加。添加前缀导致相当长的跨浏览器代码：

```javascript
// full-screen available?
if (
    document.fullscreenEnabled || 
    document.webkitFullscreenEnabled || 
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
) {
...
}
```
Opera 12 是唯一不需要使用前缀的浏览器，当 Opera 15+ 需要使用 `webkit`。

### **element.requestFullscreen** *(changeed)*
这个方法使得单个 element full-screen。
```javascript
document.getElementById("myimage").requestFullscreen();
```
同样，'screen' 已经切换到小写。跨浏览器代码：
```javascript
var i = document.getElementById("myimage");
 
// go full-screen
if (i.requestFullscreen) {
    i.requestFullscreen();
} else if (i.webkitRequestFullscreen) {
    i.webkitRequestFullscreen();
} else if (i.mozRequestFullScreen) {
    i.mozRequestFullScreen();
} else if (i.msRequestFullscreen) {
    i.msRequestFullscreen();
}
```
### **document.fullscreenElement** *(changed)*
这个属性返回当前 full-screen 的 element，如果没有返回 null。
```javascript
if (document.fullscreenElement) { ... }
```
'screen' 现在是小写。跨浏览器代码：
```javascript
// are we full-screen?
if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
) {
...
}
```
### **document.exitFullscreen** *(changed)*
这个方法退出 full-screen mode：
```javascript
document.exitFullscreen;
```
同样，'screen' 为小写。它以前的名字为 `cancelFullScreen`，Firefox 仍然为它。跨浏览器代码：
```javascript
// exit full-screen
if (document.exitFullscreen) {
    document.exitFullscreen();
} else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
} else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
} else if (document.msExitFullscreen) {
    document.msExitFullscreen();
}
```
### **document.fullscreenchange event**
此 event 在移入移出 full-screen view 时触发。它没有提供信息，当你可以通过检查 **document.fullscreenElement** 是否为 `null` 来确定是否 full-screen。
```javascript
document.addEventListener("fullscreenchange", function() { ... });
```
它的名称没有改变，但需要添加跨浏览器前缀和骆驼写法的 IE 代码：
```javascript
document.addEventListener("fullscreenchange", FShandler);
document.addEventListener("webkitfullscreenchange", FShandler);
document.addEventListener("mozfullscreenchange", FShandler);
document.addEventListener("MSFullscreenChange", FShandler);
```
### **document.fullscreenerror event**
Full-screen 可能失败。例如，内 iframe 没有 allowfullscreen 属性或窗口插件内容可能被阻止。一个 fullscreenerror event 可能因此被触发：
```javascript
document.addEventListener("fullscreenerror", function() { ... });

```
它的名称没有改变，但需要添加跨浏览器前缀和骆驼写法的 IE 代码：
```javascript
document.addEventListener("fullscreenerror", FSerrorhandler);
document.addEventListener("webkitfullscreenerror", FSerrorhandler);
document.addEventListener("mozfullscreenerror", FSerrorhandler);
document.addEventListener("MSFullscreenError", FSerrorhandler);

```

## Full-Screen CSS
我们也可以用 CSS 影响 full-screen styles...

### **:fullscreen pseudo class** *(changed)*
但在 full-screen 查看，你可以在应用 styles 到一个 element 或它的子元素。
```css
:fullscreen {
    ...
}
```
它以前的名称是 `:full-screen`，在 Webkit 和 Firefox 依旧如此。跨浏览器代码：
```css
:-webkit-full-screen {
}
 
:-moz-full-screen {
}
 
:-ms-fullscreen {
}
 
:fullscreen {
}
```
### **::backdrop** *(new)*
但具有不同 aspect-ratio(纵横比)的元素在 full-screen 下查看，你可以应用 color 或 image 到 backdrop。
```css
:fullscreen::backdrop {
    background-color: #006; /* dark blue */
}
```
backdrop 是背后的 fullscreen element，但高于所有其他网页内容的 pseudo element(伪元素)。IE11 支持它，而 Firefox 和 Opera 12 浏览器不支持，Safari 和 Opera 15+ 包含 backdrop 元素，但不会允许修改它的 style。目前，你可以只针对 IE11，如：
```css
:-ms-fullscreen::-ms-backdrop {
    background-color: #006; /* dark blue */
}
```

## Styling Differences(样式的差异)
在 IE11，Firefox 和 Opera 12 `full-screen`元素 `width` 和 `height` 设置为 100%。图片被拉伸并且纵横比被忽略。在 IE11 设置 width 和 height，position 一个 full-screen element 到黑色 backdrop 的左上角(配置 ::backdrop)。Opera 12 类似于 IE11 但显示一个透明 backdrop。Firefox 忽略尺寸。在 Chrome，Safari 和 Opera 15+ 中 element 居中并有一个黑色 backdrop。

如果你想要一些一致性，很容易使得 Webkit/Blink 浏览器拉伸如 Firefox/IE11：
```css
:-webkit-full-screen {
    position: fixed;
    width: 100%;
    top: 0;
    background: none;
}
```
或者，你也可以让 IE11 遵循 Webkit/Blink 中心定位：
```css
:-ms-fullscreen {
  width: auto;
  height: auto;
  margin: auto;
}
```
这种方法不适用于 Firefox，它忽略 width 和 height。为了解决这个问题，你需要使得 parent element full-screen 并应用适当的大小如本 [demo](fullscreen.html)。

## Ready for Deployment?(准备好部署？)
HTML5 Full-Screen API 比较简单，但浏览器的差异导致丑陋的代码，而且也不能保证它不会再改变。情况会有所改善，因此它可能投入时间和精力于其他功能，直到该 API 更稳定。

也就是说，full-screen 对于 HTML5 game 和注重 video 的网站是必不可少的。如果你不想自己维护代码，可以考虑使用一个库，如 [screenfull.js][3] 平滑处理了差异，祝您好运！



  [1]: http://www.sitepoint.com/use-html5-full-screen-api/
  [2]: http://caniuse.com/fullscreen "caniuse"
  [3]: https://github.com/sindresorhus/screenfull.js/
  [4]: https://fullscreen.spec.whatwg.org/