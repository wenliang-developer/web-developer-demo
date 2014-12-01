# Data URIs
[TOC]

data URIs 是由 [RFC2397][RFC2397] 定义，允许将一个小文件进行编码后嵌入到另外一个文档里。

## 简介
data URIs 的语法结构如下：
```
data:[<mediatype>][;base64],<data>
```

<mediatype> 是一个 internet media type specification(该参数可选)。如果被省略，它默认为 text/plain;charset=US-ASCII。作为一个缩写，"text/plain" 可以省略 charset 参数。
";base64"：意味着 `data` 按 Base64 编码。如果没有 ";base64"，该 `data`(是一个八位字节序列)中 URL 安全范围内的字符使用 ASCII 编码为八位字节，超出范围的使用标准 %xx 十六进制编码。
Data URL scheme 对应小的数值非常有用。注意在某些应用程序中使用 URLs 具有长度限制；例如，HTML 中 `<a>` 的 URL 有长度限制(在 HTML [RFC1866][RFC1866] 的 SGML 中声明)。限制在 1024 个字符以内。

Data URL scheme 没有相对 URL 格式。

## 语法
```
dataurl    := "data:" [ mediatype ] [ ";base64" ] "," data
mediatype  := [ type "/" subtype ] *( ";" parameter )
data       := *urlchar
parameter  := attribute "=" value
```
其中 "urlchar" 来自[RFC2396]. "type"，"subtype"，"attribute"，"value" 相应的标记来自[RFC2045]，代表利用 URL 转义为必要的编码[RFC2396]。

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

## Data URIs 转换工具
你可以使用在线网站 [data URI kitchen][3], 来把一个字符串或文件转换成 data URI。

## 参考链接

- [Data URIs 浏览器支持性][1]
- [MDN：data URIs][2]




  [RFC2397]: http://www.ietf.org/rfc/rfc2397.txt "The "data" URL scheme"
  
  [RFC1866]: http://www.ietf.org/rfc/rfc1866.txt
  [1]: http://caniuse.com/datauri 
  [2]: https://developer.mozilla.org/zh-CN/docs/data_URIs
  [3]: http://software.hixie.ch/utilities/cgi/data/data
 