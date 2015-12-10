# meta 标签

在介绍移动端特有 meta 标签之前，先简单说一下 HTML meta 标签的一些知识。

meta 标签包含了 HTTP 标题信息 (http-equiv) 和 页面描述信息 (name)。

- http-equiv:

该枚举的属性定义，可以改变服务器和用户代理行为的编译。编译的值取content 里的内容。简单来说即可以模拟 HTTP 协议响应头。

最常见的大概属于 Content-Type 了，设置编码类型。如
```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
```
H5中可以简化为
```html
<meta charset="utf-8">
```

http-equiv常见还有其它如下等（合理使用可增加 SEO 收录）。
-- Content-Language : 设置网页语言
-- Refresh : 指定时间刷新页面
-- set-cookie : 设定页面 cookie 过期时间
-- last-modified : 页面最后生成时间
-- expires : 设置 cache 过期时间
-- cache-control : 设置文档的缓存机制
-- ...

- name: 该属性定义了文档级元数据的名称。用于对应网页内容，便于搜索引擎查找分类，如 keywords, description; 也可以使用浏览器厂商自定义的 meta， 如 viewport；

##移动端特有属性
###viewport

可视区域的定义，如屏幕缩放等。告诉浏览器如何规范的渲染网页。
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
```

###format-detection

对电话号码的识别
```html
<meta name="format-detection" content="telphone=no" />
```

##IOS私有属性

###pple-mobile-web-app-capable

启用 webapp 模式, 会隐藏工具栏和菜单栏，和其它配合使用。
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
apple-mobile-web-app-status-bar-style
```
在webapp模式下，改变顶部状态条的颜色。
```html
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
```
default(白色，默认) | black(黑色) | black-translucent(半透明)

注意：若值为“black-translucent”将会占据页面位置，浮在页面上方（会覆盖页面 20px 高度， Retina 屏幕为 40px ）。

##webapp对应的Link标签

###apple-touch-icon

在webapp下，指定放置主屏幕上 icon 文件路径;
```html
<link rel="apple-touch-icon" href="touch-icon-iphone.png">
<link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
<link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">
```
默认 iphone 大小为 60px, ipad 为 76px, retina 屏乘2；

如没有一致尺寸的图标，会优先选择比推荐尺寸大，但是最接近推荐尺寸的图标。

ios7以前系统默认会对图标添加特效（圆角及高光），如果不希望系统添加特效，则可以用apple-touch-icon-precomposed.png代替apple-touch-icon.png

###apple-touch-startup-image

在 webapp 下，设置启动时候的界面;
```html
<link rel="apple-touch-startup-image" href="/startup.png" />
```
不支持 size 属性，可以使用 media query 来控制。iphone 和 touch 上，图片大小必须是 230*480 px,只支持竖屏;

##其它meta
```html
<!-- 启用360浏览器的极速模式(webkit) -->
<meta name="renderer" content="webkit">
<!-- 避免IE使用兼容模式 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
<meta name="HandheldFriendly" content="true">
<!-- 微软的老式浏览器 -->
<meta name="MobileOptimized" content="320">
<!-- uc强制竖屏 -->
<meta name="screen-orientation" content="portrait">
<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait">
<!-- UC强制全屏 -->
<meta name="full-screen" content="yes">
<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="true">
<!-- UC应用模式 -->
<meta name="browsermode" content="application">
<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app">
<!-- windows phone 点击无高光 -->
<meta name="msapplication-tap-highlight" content="no">
```

末尾总结

所以，一般新建页面的时候，可以采用如下结构， 再依据自己的实际需要添加所需即可。
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="format-detection"content="telephone=no" />
  <title>Demo</title>
</head>
<body>
  <!-- code here -->
</body>
</html>
```
