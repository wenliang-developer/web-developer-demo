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

