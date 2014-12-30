# dataset & data-* attributes
[TOC]

一个 customer data attribute 是没有名称空间以字符 "**data-**" 开头命名的一个 attribute，连字符后至少有一个字符，它是 XML-compatible(XML兼容)，并且不包含大写的 ASCII 字符串。
> NOTE:
> 在 HTML documents 中的 HTML elements 的所有 attribute names 通过小写 ASCII 访问，这个特点使得大写 ASCII 的限制并不影响这些 document。

Custom data attributes 用于存储 `page` 或 `application` private 的自定义 data，不存在任何更合适的 attributes 或 elements。

每个 HTML element 可以具有任意 custom data attribute 属性，和任意的 value。

> Note:
> 
> ***element* . dataset**

> 返回 element data-* attribute 的 DOMStringMap 对象。
> 连字符连接的名称使用骆驼格式。例如， data-foo-bar="" 变为 element.dataset.fooBar。

通过了 element 的 dataset 属性访问所有的 data-* attribute。

Example：
如果一个网页要代表一个太空飞船，比如一个 element 作为游戏的一部分，它会使用 class 属性以及 data-* 属性：
```html
<div class="spaceship" data-ship-id="92432"
     data-weapons="laser 2" data-shields="50%"
     data-x="30" data-y="10" data-z="90">
 <button class="fire"
         onclick="spaceships[this.parentNode.dataset.shipId].fire()">
  Fire
 </button>
</div>
```
作者应该精心设计这样的扩展，这样，当 attribute 被忽略，任何相关的 CSS 被丢弃，页面仍然可用。

User agents 不能获得这些 attribute 值或实施任何行为。规范指出 User agents 不能定义这些 attribute 具有任何有意义的值。

Javascript 库可使用 custom data attributes，因为它们被认为是在其使用网页的一部分。鼓励许多库的作者，在 attribute name 中包含他们的名字，以减少冲突的风险。

## 参考链接

- [dataset & data-* attributes][1]
- [dataset & data-* attributes 浏览器支持性][2]



  [1]: https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes
  [2]: http://caniuse.com/dataset
  
 