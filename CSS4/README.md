# 精妙绝伦的 CSS4
[TOC]


以下是各模块相关规范：

 1. CSS Pseudo-Elements Module Level 4 -- http://www.w3.org/TR/css-pseudo-4/
     - ::selection -- 设置选中文本后的背景色与前景色。
 ```css
/*Webkit,Opera9.5+,Ie9+*/
::selection {
    background: 颜色值;
    color:颜色值;
}
/*Mozilla Firefox*/
::-moz-selection {
    background: 颜色值;
    color:颜色值;
}
```
 2. Compositing and Blending Level 1 (混合模式) -- http://www.w3.org/TR/compositing-1/
     - mix-blend-mode -- 主要是用于源与背景颜色或背景图像混合.
     - isolation -- 用来设置源是否与其他元素隔离.
     - background-blend-mode -- 用来定义元素背景层的混合模式.

## 扩展阅读

 - [Wikipedia - CSS][1] —— `CSS` 相关介绍。


[1]: http://en.wikipedia.org/wiki/Cascading_Style_Sheets
  
 