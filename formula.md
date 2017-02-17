#重要公式

## 几何
1. 计算以正多边形内任意一点作为圆心，正好包裹正多边形所需要的半径。
```javascript
  //坐标系为屏幕坐标系，左上角为(0,0)，向下 y 轴递增，向右 x 轴递增。

  //x、y 为相对正多边形左上角的坐标
  var y;
  var x;

  // 正多边形宽高
  var w;
  var h;

  // get offset
  var offsetX = Math.abs(w / 2 - x);
  var offsetY = Math.abs(h / 2 - y);

  // get delta
  var deltaX = w / 2 + offsetX;
  var deltaY = h / 2 + offsetY;

  // calculate radius     c^2 = a^2 + c^2 -2*a*b*cos(A)
  var radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2) - 2 * deltaX * deltaY * Math.cos(90 / 180 * Math.PI));
```

2. 判断鼠标移入、移出物体的方向
```javascript
/**
 * @param elem
 * @param e: MouseEnter or MouseOut event
 */
function getDirection(elem, e){
    var w = elem.offsetWidth,
        h = elem.offsetHeight;
    var x = (e.pageX - elem.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
    var y = (e.pageY - elem.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);
    var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
    switch (direction) {
        case 0: 'top'; break;
        case 1: 'right'; break;
        case 2: 'bottom'; break;
        case 3: 'left'; break;
    }
}
```

> 1. 将判断区域问题转成判断角度。
> 2. 计算相对于物体中心的坐标
> 该元素的坐标原点是(offsetLeft, offsetTop),那么要转成判断角度，必须将原点拉到该元素的中点上。则中点的坐标是Oz(  offsetLeft + w/2,  offsetTop + h/2  );那么鼠标落入的点M(e.pageX,e.pageY);
> 如果要将这个点转成以Oz为中心，那么就得换算成 x点：e.pageX - (offsetLeft + w/2) ； y点：e.pageY - (offsetTop + h/2)。那么x和y就出来了。(w > h ? (h / w) : 1)和 (h > w ? (w / h) : 1)这两个请先忽略，后面会解释。
> 3. 计算角度
> Math.atan2(x,y)这个函数返回的值相当于这个点的角度，当然貌似这些编程语言里返回的基本都是弧度。而这代码是用角度来算的所以避免不了弧度和角度的转换，
> 公式：弧度=角度乘以π后再除以180，角度=弧度除以π再乘以180
> (Math.atan2(y, x) * (180 / Math.PI)  其实等于这个 (Math.atan2(y, x) / ( Math.PI/ 180)
> 4. 核心
> Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
>  - +180 ：从第三步我们可以得到角度了，但为什么还要加个180，原因是原来的坐标轴是(-180,180)度的，加个180那么就都成正的，即(0,360)，这个不难理解。
>  - /90 ：那为什么要除于90呢，要知道90，就必须理解  (w > h ? (h / w) : 1)和 (h > w ? (w / h) : 1) 这段代码的意思将矩形矫正成正方形（特殊矩形的矩形是正方形所以也就有了这种判断，其实判不判段都一样）。如果我们的元素是个正方形的话，那两条对角线相交的那些角就都是90度了。
>  - +3 : 的意思，只要知道我们角度区间是从右上方开始算起的，然后顺时针计算的就可以了。该作者想要将结果显示的顺序是 上右下左，所以加三就是将第一区间变成上。
>  - Math.round() ,四舍五入，那么问题来，我们的X轴和Y轴可不是斜着的呀，那这样角度计算不就成问题了。所以就由Math.round()函数发挥作用了，比如计算下0-90中任何一个数除于除于90，我们可以得到 0~1之间的数，如果加个四舍五入呢？那么结果就只有0和1了，刚好45度角是我们分割线。（只能说写出这个代码的人牛）
>  - %4取余，保证结果是0、1、2、3 之间的一个（分别代表上、右、下、左）。



##颜色
1.颜色矩阵
```
   | R | G | B | A | +
---|-------------------
 R | 1 | 0 | 0 | 0 | 0
---|-------------------
 G | 0 | 1 | 0 | 0 | 0
---|-------------------
 B | 0 | 0 | 1 | 0 | 0
---|-------------------
 A | 0 | 0 | 0 | 1 | 0
---|-------------------

   | R | G | B | A | +
---|-------------------
 R |m11|m12|m13|m14|m15
---|-------------------
 G |m21|m22|m23|m24|m25
---|-------------------
 B |m31|m32|m33|m34|m35
---|-------------------
 A |m41|m42|m43|m44|m45
---|-------------------

//其中 R、G、B、A 分别是 输入图像的对应像素点的 red、green、blue、alpha 值。
公式为:
r=R*m11+G*m21+B*m31+A*m41+m51*255
g=R*m12+G*m22+B*m32+A*m42+m52*255
b=R*m13+G*m23+B*m33+A*m43+m53*255
a=R*m14+G*m24+B*m34+A*m44+m54*255
```

