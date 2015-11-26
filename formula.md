#重要公式

## 几何
1. 计算正多边形内任意一点作为圆心，正好包裹正多边形所需要的半径。
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
