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

##viewport
视图窗口，移动端特属的标签。一般使用下面这段代码即可：
```
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />
```
上面的代码依次表示设置宽度为设备的宽度，默认不缩放，不允许用户缩放（即禁止缩放），在网页加载时隐藏地址栏与导航栏（ios7.1新增）。
```
width – // [pixel_value | device-width] viewport 的宽度，范围从 200 到 10,000，默认为 980 像素
height – // [pixel_value | device-height ] viewport 的高度，范围从 223 到 10,000 
initial-scale – // float_value，初始的缩放比例 （范围从 > 0 到 10）
minimum-scale – // float_value，允许用户缩放到的最小比例
maximum-scale – // float_value，允许用户缩放到的最大比例
user-scalable – // [yes | no] 用户是否可以手动缩放
target-densitydpi = [dpi_value | device-dpi | high-dpi | medium-dpi | low-dpi] 目标屏幕像素密度
```
注：target-densitydpi屏幕像素密度和缩放有关，用手机看下实际效果。我一般不设置这个属性。

###apple-mobile-web-app-capable
是否启动webapp功能，会删除默认的苹果工具栏和菜单栏。
```
<meta name="apple-mobile-web-app-capable" content="yes" />
```
###apple-mobile-web-app-status-bar-style

当启动webapp功能时，显示手机信号、时间、电池的顶部导航栏的颜色。默认值为default（白色），可以定为black（黑色）和black-translucent（灰色半透明）。这个主要是根据实际的页面设计的主体色为搭配来进行设置。
```
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
```
注：如果对apple-mobile-web-app-capable和apple-mobile-web-app-status-bar-style不太理解，可查阅下面的参考资料第三篇文章，里面有截图说明。

##telephone & email

忽略页面中的数字识别为电话号码
```
<meta name="format-detection" content="telephone=no" />
```
同样还有一个email识别
```
<meta name="format-detection" content="email=no" />
```
当然两者可以写在一起
```
<meta name="format-detection" content="telphone=no, email=no" />
```
其他meta
```
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
参考资料：
- [Supported Meta Tags section of the Safari HTML Reference](https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)
- [移动前端工作的那些事---前端制作篇之meta标签篇](http://blog.sina.com.cn/s/blog_3f1fc8950101fz2v.html)
- [移动平台的meta标签-----神奇的功效](http://blog.sina.com.cn/s/blog_6d48e77101015kqr.html)
- [WebApp之Meta标签](http://www.haogongju.net/art/2709254)

##link标签
###apple-touch-icon

如果apple-mobile-web-app-capable设置为yes了，那么在iPhone,iPad,iTouch的safari上可以使用添加到主屏按钮将网站添加到主屏幕上。而通过设置相应apple-touch-icon标签，则添加到主屏上的图标就会使用我们指定的图片。

以下是针对ox不同设备，选择一个最优icon。默认iphone的大小为60px，ipad为76px，retina屏乘以2倍。
```
<link rel="apple-touch-icon" href="touch-icon-iphone.png">
<link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
<link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">
```
ios7以前系统默认会对图标添加特效（圆角及高光），如果不希望系统添加特效，则可以用apple-touch-icon-precomposed.png代替apple-touch-icon.png

图标使用的优先级如下：

- 如果没有跟相应设备推荐尺寸一致的图标，那个会优先使用比推荐尺寸大，但最接近推荐尺寸的图标。
- 如果没有比推荐尺寸大的图标，会优先选择最接近推荐尺寸的图标。
- 如些有多个图标符合推荐尺寸，会优先选择包含关键字precomposed的图标。
- 如果未在区域指定用link标签指定图标，会自动搜索网站根目录下以apple-touch-icon为前缀的png图标。

注：ios7不再为icon添加特效，ios7以前则默认为icon添加特效，除非icon有关键字-precomposed.png为后缀。

参考资料：
- [Specifying a Webpage Icon for Web Clip](https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [WebApp之 apple-touch-icon](http://blog.sina.com.cn/s/blog_5a073f0f01014jfc.html)
- http://taylor.fausak.me/2013/11/01/ios-7-web-apps/


###apple-touch-startup-image

同样基于apple-mobile-web-app-capable设置为yes，可以用WebApp设置一个类似NativeApp的启动画面。
```
<link rel="apple-touch-startup-image" href="/startup.png">
```
和apple-touch-icon不同，apple-mobile-web-app-capable不支持sizes属性，所以使用media来控制retina和横竖屏加载不同的启动画面。
```
// iPhone
<link href="apple-touch-startup-image-320x460.png" media="(device-width: 320px)" rel="apple-touch-startup-image" />

// iPhone Retina
<link href="apple-touch-startup-image-640x920.png" media="(device-width: 320px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />

// iPhone 5
<link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="apple-touch-startup-image-640x1096.png">

// iPad portrait
<link href="apple-touch-startup-image-768x1004.png" media="(device-width: 768px) and (orientation: portrait)" rel="apple-touch-startup-image" />

// iPad landscape
<link href="apple-touch-startup-image-748x1024.png" media="(device-width: 768px) and (orientation: landscape)" rel="apple-touch-startup-image" />

// iPad Retina portrait
<link href="apple-touch-startup-image-1536x2008.png" media="(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />

// iPad Retina landscape
<link href="apple-touch-startup-image-1496x2048.png"media="(device-width: 1536px)  and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)"rel="apple-touch-startup-image" />
```

参考资料：

- [Launch Images](https://developer.apple.com/library/safari/documentation/UserExperience/Conceptual/MobileHIG/LaunchImages.html#//apple_ref/doc/uid/TP40006556-CH22-SW1)
- [iOS Web App Icons & Startup Images](http://taylor.fausak.me/2012/03/27/ios-web-app-icons-and-startup-images/)
- [iPhone 5 Web App Startup Image](http://taylor.fausak.me/2012/09/20/iphone-5-web-app-startup-image/)

##总结

空白页面模板，然后再根据具体情况在此基础上添加apple-touch-icon和apple-touch-startup-image
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="format-detection"content="telephone=no, email=no" />
    <title>Document</title>
</head>
<body>

</body>
</html>
```
