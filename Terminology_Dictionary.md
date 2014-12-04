# Terminology Dictionary
[TOC]

## User agents
在计算机科学中，用户代理（英语：User Agent）指的是代表用户行为的软件（软件代理程序）所提供的对自己的一个标识符。例如，一个电子邮件阅读器就是一个电子邮件客户端，而在会话发起协议（SIP）中，用户代理的术语指代的是一个通信会话的所有两个终端。

## polyfill
在2010年10月份的时候,Remy Sharp在博客上发表了一篇关于术语"[polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill)"的文章。

> 一个polyfill是一段代码(或者插件),提供了那些开发者们希望浏览器原生提供支持的功能.

我们通常的做法是先检查当前浏览器是否支持某个API,如果不支持的话就加载对应的polyfill.然后新旧浏览器就都可以使用这个API了。