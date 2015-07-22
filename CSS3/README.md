# 激动人心的 CSS3
[TOC]




由于过于庞大，`CSS3` 遵循模块开发，这将有助于理清模块化规范之间的关系。以下是 `CSS` 分类及其状态图详情请参阅 [wikipedia -- File:CSS3_taxonomy_and_status_by_Sergey_Mavrody.svg][1]：

<img src="./images/CSS3_taxonomy_and_status_by_Sergey_Mavrody.svg.png" style="max-width:100%"/>

非 w3c 标准：

 1. CSS Reflections -- https://www.webkit.org/blog/182/css-reflections/
     - box-reflect -- `-webkit-box-reflect: <direction> <offset> <mask-box-image>`

以下是各模块相关规范：

 1. Selector (选择器) -- http://www.w3.org/TR/css3-selectors/
 2. CSS Flexible Box Layout Module Level 1 -- http://www.w3.org/TR/css-flexbox-1/
     - flex -- 指定了一个数字，代表了这个伸缩项目该占用的剩余空间比例
     - flex-grow -- 伸展系数
     - flex-shrink -- 收缩系数
     - flex-basis -- 定义了 Flex 项目在分配 Flex 容器剩余空间之前的一个默认尺寸
     - flex-direction: `row | row-reverse | column | column-reverse` -- 弹性布局，轴线方向
     - flex-wrap: `nowrap | wrap | wrap-reverse` -- 换行方式
     - flex-flow: `<flex-direction> || <flex-wrap>`
     - justify-content: `flex-start | flex-end | center | space-between | space-around` -- 主轴对齐
     - align-items: ` flex-start | flex-end | center | baseline | stretch` -- 侧轴子元素对齐
     - align-content: `flex-start | flex-end | center | space-between | space-around | stretch`  -- 伸缩行对齐方式
     - align-self -- 侧轴对齐，在flex子元素上设置
     - order -- 显示顺序
     - "margin:auto" -- 一个 "auto" 的 margin 会合并剩余的空间。它可以用来把伸缩项目挤到其他位置。
 3. CSS Image Values and Replaced Content Module Level 3 -- http://www.w3.org/TR/css3-images/
     - Gradients
     - object-fit 属性指定了替换元素(replaced elements)的内容应该如何使用他的宽度和高度来填充其容器.
     - object-position 属性指定了替换元素在容器中的对齐方式.
 4. CSS Color Module Level 3 -- http://www.w3.org/TR/css3-color/
     - RGB
     - RGBA
     - HSL
     - HSLA
     - opacity
 5. CSS Backgrounds and Borders Module Level 3 -- http://www.w3.org/TR/css3-background/
     - border-radius
     - box-shadow：`inset x-offset y-offset blur-radius spread-radius color`
     - border-image
     - border-image-source
     - border-image-slice
     - border-image-width
     - border-image-repeat
     - background -- multiple background
     - background-size
     - background-clip: `border-box | padding-box | content-box`
     - background-origin: `border-box | padding-box | content-box` -- 设置背景图片显示原点
 6. CSS Text Decoration Module Level 3 -- http://www.w3.org/TR/css-text-decor-3
     - text-shadow：`X-Offset Y-Offset Blur Color`
 7. CSS Text Module Level 3 -- http://www.w3.org/TR/css-text-3/
     - word-wrap
     - word-break
     - white-space
 8. CSS Transforms Module Level 1 -- http://www.w3.org/TR/css-transforms-1/
     - Transform
     - transform-origin
     - transform-style：`flat|preserve-3d`
     - perspective：`none | <length>`
     - perspective-origin
     - backface-visibility -- 定义当元素不面向屏幕时是否可见。如果在旋转元素不希望看到其背面时，该属性很有用。
 9. CSS Transitions -- http://www.w3.org/TR/css3-transitions/
     - transition: `<property> <duration> <animation type> <delay>`
     - transition-property -- 作用的属性
     - transition-duration -- 持续时间
     - transition-timing-function
     - transition-delay -- 延迟
 10. CSS Animations -- http://www.w3.org/TR/css3-animations/
     - animation
     - animation-name
     - animation-duration
     - animation-timing-function
     - animation-delay
     - animation-iteration-count
     - animation-direction
     - animation-play-state
 11. CSS Basic User Interface Module Level 3 (CSS3 UI) -- http://www.w3.org/TR/css3-ui/
     - text-overflow
     - box-sizing: `content-box | padding-box | border-box`

 12. CSS Fonts Module Level 3 -- http://www.w3.org/TR/css-fonts-3/
     - @font-face: download font url
         - http://www.google.com/webfonts
         - http://www.dafont.com/
         - http://www.fontsquirrel.com/tools/webfont-generator -- 字体转换工具
         - http://www.youziku.com/ -- 有字库 中文字体转换 @font-face
 13. CSS Multi-column Layout Module -- http://www.w3.org/TR/css3-multicol/
     - column-count
     - column-width
     - column-gap: 列间隔
     - column-rule: 列分隔线样式，不占用空间
     - column-rule-color
     - column-rule-style
     - column-rule-width
     - column-span: 跨列显示

 14. Media Queries -- http://www.w3.org/TR/css3-mediaqueries/
 15. Filter Effects Module Level 1 -- http://www.w3.org/TR/filter-effects-1/
     - filter：
         - grayscale 灰度
         - sepia 褐色
         - saturate 饱和度
         - hue-rotate 色相旋转
         - invert 反色
         - opacity 透明度
         - brightness 亮度
         - contrast 对比度
         - blur 模糊
         - drop-shadow 阴影
 16. CSS Values and Units Module Level 3 -- http://www.w3.org/TR/css3-values/
     - calc() -- calculate(计算)
 17. CSS Conditional Rules Module Level 3 -- http://www.w3.org/TR/css3-conditional/
     - @supports 
     - @media

 18. CSS Grid Layout Module Level 1 -- http://www.w3.org/TR/css-grid-1/
     - grid-template-columns
     - grid-template-rows
     - grid-template-areas
     - grid-column
     - grid-row
     - grid-area
     - grid-auto-flow
 19. CSS Masking Module Level 1 -- http://www.w3.org/TR/css-masking-1/
     - clip-path
     - mask-image
 20. Compositing and Blending Level 1 -- http://www.w3.org/TR/compositing-1/
     - mix-blend-mode
## 扩展阅读
 - [Wikipedia - CSS][2] —— `CSS` 相关介绍。


[1]: http://en.wikipedia.org/wiki/File:CSS3_taxonomy_and_status_by_Sergey_Mavrody.svg
[2]: http://en.wikipedia.org/wiki/Cascading_Style_Sheets
  
 
