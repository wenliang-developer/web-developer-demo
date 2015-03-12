# 激动人心的 CSS3
[TOC]




由于过于庞大，`CSS3` 遵循模块开发，这将有助于理清模块化规范之间的关系。以下是 `CSS` 分类及其状态图详情请参阅 [wikipedia -- File:CSS3_taxonomy_and_status_by_Sergey_Mavrody.svg][1]：

<img src="./images/CSS3_taxonomy_and_status_by_Sergey_Mavrody.svg.png" style="max-width:100%"/>

以下是各模块相关规范：

 1. Selector (选择器) -- http://www.w3.org/TR/css3-selectors/
 2. Flexible Layout -- http://www.w3.org/TR/css3-flexbox/
 3. CSS Image Values and Replaced Content Module Level 3 -- http://www.w3.org/TR/css3-images/
     - Gradients
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


## 扩展阅读

 - [Wikipedia - CSS][2] —— `CSS` 相关介绍。


[1]: http://en.wikipedia.org/wiki/File:CSS3_taxonomy_and_status_by_Sergey_Mavrody.svg
[2]: http://en.wikipedia.org/wiki/Cascading_Style_Sheets
  
 