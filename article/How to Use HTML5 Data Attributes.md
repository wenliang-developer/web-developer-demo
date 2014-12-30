# [How to Use HTML5 Data Attributes][1](译文)
[TOC]

早在老的 XHTML/HTML4 的时候，开发商存储与 DOM 相关联的任意数据时，有几个选项。你可以创造自己的 attribute，但这是有风险的；当浏览器忽略这些数据，你的代码将无效，并且如果名字曾经是一个标准的 HTML attribute ，它会引起一些问题。

因此，大多数开发人员依赖 `class` 或 `rel` attribute，因为它们是唯一允许灵活应用字符串的属性。例如，假设我们正在创建一个 widget 显示信息，如 Twitter 时间表。理想情况下，JavaScript 应该不改变代码的配置 —— 因此，我们定义了用户的 ID 在 `class` 的属性中，如：
```html
<div id="msglist" class="user_bob"></div>
```
我们的代码会查找 ID 为 **msglist** 的 element。解析以小写字符串 **user_** 开始的 class 名，假设 "bob" 是 ID 并显示来自 user 的所有 message。

假设我们当前就想知道 message 的最大数量，并忽略那些超过 6 个月(180)信息。
```html
<div id="msglist" class="user_bob list-size_5 maxage_180"></div>
```
我们的 class 属性也越来越繁琐；它很容易出错并且 JavaScript 解析比较复杂。

## HTML5 data Attributes
幸运的是，HTML5 引入 custom data attribute。你可以使用任意以 **data-** 为前缀的小写名称，例如。
```html
<div id="msglist" data-user="bob" data-list-size="5" data-maxage="180"></div>
```
Custom data attributes：

 - 是一个字符串 —— 你可以存储任何字符串编码，如 JSON。类型转换必须在 JavaScript 中进行处理。
 - 但没有适合的 HTML5 element 和 attribute 的时候，才应使用。
 - 是私有的页面，不同于 microformats，它们应该被外部系统，如搜索引擎机器人忽略。

## JavaScript Parsing #1: getAttribute and setAttribute
所有浏览器都可以让你获取并使用 `getAttribute` 和 `setAttribute` 方法修改 `data-` 属性，例如：
```javascript
var msglist = document.getElementById("msglist");
 
var show = msglist.getAttribute("data-list-size");
msglist.setAttribute("data-list-size", +show+3);
```
它可以工作，但只用作回退方案在旧的浏览器中使用。

## JavaScript Parsing #2: jQuery data() method
自 version 1.4.3，jQuery 的 data() 方法可以解析 HTML5 data attributes。你不需要指定 **data-** 前缀，等效的代码可以这样写：
```javascript
var msglist = $("#msglist");
 
var show = msglist.data("list-size");
msglist.data("list-size", show+3);
```
然而，要小心 jQuery 巧妙的试图将数据转换为适合的类型(boolean，number，object，array 或 null)并且可以避免接触 DOM。不像 setAttribute，data() 方法并没有物理改变 data-list-size attributes —— 如果使用 jQuery 以外的方法，它的值仍然为 "5"。

## JavaScript Parsing #3: the dataset API
最后，我们有 HTML5 dataset API 返回一个 DOMStringMap 对象。你应该注意到，data-attribute 名的 data- 前缀将被丢弃，删除连字符并转换为驼峰写法的 map，例如：
|  attribute name | dataset API name |
| --------------- | ---------------- |
| data-user       | user             |
| data-maxage     | maxage           |
| data-list-size  | listSize         |
 
我们的新代码：
```javascript
ar msglist = document.getElementById("msglist");
 
var show = msglist.dataset.listSize;
msglist.dataset.listSize = +show+3;
```
DataList API 在所有现代浏览器中得到支持(IE10 和一下版本不能支持)。[可用的 shim(垫片)](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills#dataset-property-for-use-with-custom-data--attributes)，但如果你为旧的浏览器编写代码，使用 jQuery 会更加和你。
 
[1]: http://www.sitepoint.com/use-html5-data-attributes/
