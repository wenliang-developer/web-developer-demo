# HTML templates
[TOC]

## browser support
browser      | version
---------    | -----
Chrome | 4+
IE (limited) | 8
Firefox | 2+
Chrome for Android | 39+
iOS Safari | 3.2+
Android Browser | 3.2+
UC Browser for Android | 9.9+
Opera Mini | 5.0-8.0
Safari | 3.1
Opera | 25+
IE Mobile (limited) | 10+
Firefox for Android | 33+

## 简介
HTML template element `<template>` 是一种持有在加载页面时不被渲染的 client-side(客户端内容)，但随后会在 JavaScript 中实例化的机制。认为模板是一个文档片段，被存储在文档中随后使用。不过，解析器是在页面加载时处理 `<template>` 元素的内容，以确保它是有效的。

在 Web development 中模板并不是新的概念。事实上 server-side templating languages/engines 已经存在很长一段时间，例如 Django(Python)、ERB/Haml(Ruby)、Smarty(PHP)。在过去今年中，我们已经看到 MVC 框架如雨后春笋一般涌现。所有的但略有不同，但大多数共享一个共同的 presentational layer(表现层，有名 view)：templates。
让我们正视它吧。Templates 真是太棒了。即使是它的定义也会让你感到温暖和舒适：
> **template** —— *一个 document 或 file 具有的预置的 format。作为特定应用程序的出发点，使得 format 不必每次使用时都需要重新创建。*

不知道你怎么理解 "...不必每次使用时都需要重新创建..." 这句话，但我喜欢避免额外的工作。那么为什么 web platform 缺乏原生支持，开发人员显然在意这个？

[WhatWG HTML Templates specification][1] 就是答案。它定义了一个新的 `<template>` 元素，它描述基于一个 DOM-based approach(基于 DOM)的 client-side templating。模板允许你声明 fragments 的标记，它会被解析为 HTML，在页面加载时出于闲置状态，但可以在运行时实例化。

## 功能检测 (Feature Detection)

`<template>` 的功能检测, 创建 DOM 元素，并检查 `.content ` 属性:
```javascript
function supportsTemplate() {
  return 'content' in document.createElement('template');
}

if (supportsTemplate()) {
  // Good to go!
} else {
  // Use old templating techniques or libraries.
}
```



## 声明模板内容
HTML `<template>` 元素代表你标记的模板。它包含了"模板内容"；可被赋值的 DOM 片段。将模板想象成脚手架，你可以在整个应用程序声明周期中使用(和重用)。
要创建模板内容，需要声明一些 markup(标记)，并把它包在 `<template>` 元素中：
```html
<template id="mytemplate">
  <img src="" alt="great image">
  <div class="comment"></div>
</template>
```
> *细心地读者可能会注意到一个空的图片。这完全是正常的(故意的)。因为它不会在页面加载是读取这个图片，在控制台产生 404 错误。我们可以动态的生成这个 URL。参见 [the pillars][the pillars]*

## The pillars
包含在 `<template>` 中的内容有一些重要的特性：

 1. 其内容是惰性的，直到被激活。从本质上讲。你的 markup 在 DOM 中是隐藏的，并没有被渲染。
 2. 模板中的任何内容不会有副作用。脚本不会运行，图片不会被加载，音频不能播放，... 直到使用模板。
 3. 内容被认为在 document 中不存在。在主页面使用 document.getElementById() 或 querySelector() 将不会返回模板的子节点。
 4. `<tempale>` 可以放置在 `<head>`，`<body>` 或 `<frameset>` 的任何地方，并且内容可以包含任何允许的元素。需要注意的是"任何地方"是指 `<template>` 可以安全得在 HTML 中解析，不允许作为内容模板的子节点。它也可以放置在 `<table>` 或 `<select>` 中:
```html
<table>
<tr>
  <template id="cells-to-repeat">
    <td>some content</td>
  </template>
</tr>
</table>
```
## Activating a template(激活模板)
若要使用 template，你需要激活它。否则其内容将永远不会呈现。要做到这一点最简单的方法是通过 templateDOM.content 使用 document.importNode() 进行深拷贝。该 `content` 属性是一个包含 template 内容的只读 DocumentFragment。
```javascript
var t = document.querySelector('#mytemplate');
// Populate the src at runtime.
t.content.querySelector('img').src = 'logo.png';

var clone = document.importNode(t.content, true);
document.body.appendChild(clone);
```
填充一个 template 后，其内容"开始运行"。在这个特色的例子中，内容被克隆，发出图片请求，并且标记被渲染。

## Demos

### Example：惰性脚本
这个例子演示了模板内容的惰性。`<script>` 仅当在按下按钮，填充模板时运行。
```html
<button onclick="useIt()">Use me</button>
<div id="container"></div>
<script>
  function useIt() {
    var content = document.querySelector('template').content;
    // Update something in the template DOM.
    var span = content.querySelector('span');
    span.textContent = parseInt(span.textContent) + 1;
    document.querySelector('#container').appendChild(
        document.importNode(content, true));
  }
</script>

<template>
  <div>Template used: <span>0</span></div>
  <script>alert('Thanks!')</script>
</template>
```

### Example: 通过 template 创建 Shadow DOM
大部分人通过为 .innerHTML 赋值一串标记来将 Shadow DOM 挂载到 host 上：
```html
<div id="host"></div>
<script>
  var shadow = document.querySelector('#host').createShadowRoot();
  shadow.innerHTML = '<span>Host node</span>';
</script>
```
这种方法的问题是获得 Shadow DOM 比较复杂。你做得更多的是字符串连接。它不整洁，事情变得凌乱。这种方法很容易滋生 XSS(跨站脚本攻击)。通过 `<template>` 来解决：
```html
<template>
<style>
  :host {
    background: #f8f8f8;
    padding: 10px;
    transition: all 400ms ease-in-out;
    box-sizing: border-box;
    border-radius: 5px;
    width: 450px;
    max-width: 100%;
  } 
  :host(:hover) {
    background: #ccc;
  }
  div {
    position: relative;
  }
  header {
    padding: 5px;
    border-bottom: 1px solid #aaa;
  }
  h3 {
    margin: 0 !important;
  }
  textarea {
    font-family: inherit;
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    border: 1px solid #aaa;
  }
  footer {
    position: absolute;
    bottom: 10px;
    right: 5px;
  }
</style>
<div>
  <header>
    <h3>Add a Comment</h3>
  </header>
  <content select="p"></content>
  <textarea></textarea>
  <footer>
    <button>Post</button>
  </footer>
</div>
</template>

<div id="host">
  <p>Instructions go here</p>
</div>

<script>
  var shadow = document.querySelector('#host').createShadowRoot();
  shadow.appendChild(document.querySelector('template').content);
</script>
```

## Gotchas (陷阱)
这里有几个使用`<template>` 时遇到的陷阱：

 1. 如果你使用 [modpagespeend][modpagespeend] 注意这个 bug。内嵌在 template 中的 `<style scoped>`，可能会因为 PageSpeed 的 CSS 重写规则，很多都被转移到 `<header>` 中。
 
 2. 没有办法"prerender(预渲染)"模板。这意味着你不能预先加载资源，处理 JS，下载最初的 CSS。等等。这也适用于服务器和客户端。模板只有在它运行时才能够呈现。
 
 3. 小心嵌套模板。它们不会像你说期望的那样。例如：
 ```html
 <template>
  <ul>
    <template>
      <li>Stuff</li>
    </template>
  </ul>
</template>
 ```
激活外层的 template 并没有激活内层 template。也就是说，嵌套模板要求它们的 children template 也要手动激活。
 
## The road to a standard (标准之路)

不要忘记我们从何处来。standards-based HTML templates 的道路是漫长的。多年来，我们已经想出了一些非常聪明的技巧用于创建可重复使用的模板。下面我以前碰到的两种最常见方法。出于比较的目的，我将它们放在本文中。 
### Method 1：Offscreen DOM
 一种方法已经使用很长一段时间了，就是创建 "offscreen" DOM 并使用 hidden 属性或 display:none 属性隐藏它。

 ```html
 <div id="mytemplate" hidden>
  <img src="logo.png">
  <div class="comment"></div>
</div>
```

这种技术的工作原理，有很多缺点。这种技术的优缺点：

- 好的：使用 DOM —— 浏览器知道 DOM。这是它擅长的。我们可以很容易的复制它。
- 好的：不让它渲染 —— 添加 hidden 属性防止它的显示。
- 坏的：没有惰性 —— 尽管我们的内容是隐藏的。仍然会发起图片请求。
- 坏的：不利于 styling 和 theming(风格化和主题化) —— 如果嵌入 template 到网页中，必须为所有嵌入模板的网页添加 #mytemplate 标记的 CSS rules。这是脆弱的，没有保证的，我们可能在未来碰到命名冲突。例如，如果嵌入的网页已经有了该 ID 的元素，我们就需要做很多更改。

### Method 2：Overloading script(重载脚本)
另一种方法时重载 `<script>` 并将其中的内容作为字符串来操作。 John Resig 可能是第一个展示该技巧的人 —— 在 2008 年他的 [Micro Templating utility][http://ejohn.org/blog/javascript-micro-templating/] 中。 目前又出现了许多新的工具，例如 handlebars.js。

例如：
```html
<script id="mytemplate" type="text/x-handlebars-template">
  <img src="logo.png">
  <div class="comment"></div>
</script>
```

该技巧的优劣：

- 好的：内容不会渲染 —— 浏览器不会渲染该块，因为 `<script>` 默认为 display:none。
- 好的：惰性 —— 浏览器就不会将它的内容当作 JS 来解析，因为脚本的类型不为 "text/javascript"。
- 坏的：安全问题 —— 鼓励使用 `innerHTML` 的。运行时分析用户提供的字符串数据，很容易导致XSS漏洞。

## 总结
还记得当 jQuery 使得操作 DOM 变为异常简单吗？结果就是 querySelector()/querySelectorAll() 被添加到了该平台中。很明显的胜利，不是吗？ 由于一个库推广了使用 CSS 选择器来获取 DOM 的方法从而使得它被规范采纳。这并不是常有的事，但我喜欢看到这样的事情发生。

我觉得 `<template>` 也是这类的案例。它为我们规范了客户端模板的方式，但更重要的是，它不再需要我们疯狂的 2008 hacks。 促使整个 web 开发过程更健全，更容易维护，功能更多，在我看来，始终都是个好事情。


## 参考链接

- [WhatWG Specification][1]
- [HTML's New Template Tag][2]
- [HTML tempaltes 浏览器支持性][3]


  [1]: https://html.spec.whatwg.org/multipage/scripting.html#the-template-element "WhatWG HTML Templates specification"
  [2]: http://www.html5rocks.com/en/tutorials/webcomponents/template/
  [3]: http://caniuse.com/#feat=template
  [modpagespeend]: http://code.google.com/p/modpagespeed/
  [the pillars]: http://www.html5rocks.com/en/tutorials/webcomponents/template/#toc-pillars
 