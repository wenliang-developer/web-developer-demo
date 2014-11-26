# Geolocation API
[TOC]

## support:
browser      | version
---------    | -----
Chrome | 31+
IE (limited) | 9+
Firefox | 30+
Chrome for Android | 39+
iOS Safari | 6.0+
Android Browser | 4+
UC Browser for Android | 9.9+
Opera Mini | NO
Safari | 5.1+
Opera | 24+
IE Mobile (limited) | 10+
Firefox for Android | 33+

## Geolocation API interface
### Geolocation interface
```
 [NoInterfaceObject]
 interface NavigatorGeolocation {
   readonly attribute Geolocation geolocation;
 };

 Navigator implements NavigatorGeolocation;
 
 [NoInterfaceObject]
 interface Geolocation { 
   void getCurrentPosition(PositionCallback successCallback,
                           optional PositionErrorCallback errorCallback,
                           optional PositionOptions options);

   long watchPosition(PositionCallback successCallback,
                      optional PositionErrorCallback errorCallback,
                      optional PositionOptions options);

   void clearWatch(long watchId);
 };

 callback PositionCallback = void (Position position);
 callback PositionErrorCallback = void (PositionError positionError);
```
### Position interface
```
  [NoInterfaceObject]
  interface Position {
    readonly attribute Coordinates coords;
    readonly attribute DOMTimeStamp timestamp;
  };
```
### Coordinates interface
```
 [NoInterfaceObject]
  interface Coordinates {
    readonly attribute double latitude;
    readonly attribute double longitude;
    readonly attribute double? altitude;
    readonly attribute double accuracy;
    readonly attribute double? altitudeAccuracy;
    readonly attribute double? heading;
    readonly attribute double? speed;
  };
```
### PositionError interface
```
[NoInterfaceObject]
  interface PositionError {
    const unsigned short PERMISSION_DENIED = 1;
    const unsigned short POSITION_UNAVAILABLE = 2;
    const unsigned short TIMEOUT = 3;
    readonly attribute unsigned short code;
    readonly attribute DOMString message;
  };
```
### PositioOptions interface
```
[NoInterfaceObject]
interface PositionOptions {
    attribute boolean enableHighAccuracy;
    attribute long timeout;
    attribute long maximumAge;
};
```


## 浏览器支持性检测
```
var isSupportGeolocation = navigator.geolocation ? true : false;
```
## 位置信息请求
### 1.单词定位请求
```
void getCurrentPosition(PositionCallback successCallback,
                           optional PositionErrorCallback errorCallback,
                           optional PositionOptions options);
```

这个函数接受一个必选参数和两个可选参数。

- successCallback —— 浏览器位置信息可用时调用的函数，该回调函数是收到实际位置信息并进行处理的地方。
- errorCallback —— 位置信息请求可能因为一些不可能因素失败，对于这种情况，可在该回调函数中进行处理。可选参数，不过建议选用。
- options —— 一个 PositionOptions 对象，用于调整 HTML5 Geolocation 服务的数据收集方式。

访问用户位置的核心代码：
```
navigator.geolocation.getCurrentPosition(updateLocation, handleLocationError);
```

#### updateLocation(Position position)
该函数只接受一个参数：Position 对象。该对象包含两个属性，coords(Coordinates 对象)和一个获取位置数据时的时间戳。

coords 最重要的属性：

- latitude (纬度)
- longitude (经度)
- accuracy (准确度)

updateLocation() 的实现代码：
```
function updateLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var accuracy = position.coords.accuracy;
    document.getElementById("latitude").innerHTML = latitude;
    document.getElementById("longitude").innerHTML = longitude;
    document.getElementById(“accuracy”).innerHTML = “This location is accurate within “ +
accuracy + “ meters.”
}
```
#### handleLocationError(PositionError positionError)
interface PositionError 中定义了所有需要处理的错误情况的错误编号，通过访问 positionError.code 获得。

- UNKNOWN_ERROR (error code 0) —— 不包含在其他错误编号中的错误。需要通过 message 参数查找错误的更多详细信息
- PERMISSION_DENIED (error code 1) —— 用户选择拒绝浏览器获得其位置信息。
- POSITION_UNAVAILABLE (error code 2) —— 尝试获取用户位置数据，但失败了。
- TIMEOUT (error code 3) —— 设置了可选的 timeout 值。尝试获取用户位置的过程超时。

处理错误：
```
function handleLocationError(error) {
    switch(error.code){
        case 0:
            updateStatus("There was an error while retrieving your location: " +
error.message);
        break;
        case 1:
            updateStatus("The user prevented this page from retrieving a location.");
        break;
        case 2:
            updateStatus("The browser was unable to determine your location: " +
error.message);
        break;
        case 3:
            updateStatus("The browser timed out before retrieving the location.");
        break;
    }
}
```

#### 可选的地理定位请求配置
这些参数可以使用 JSON 对象传递，它们可以改变 HTML5 Geolocation 服务收集数据的方式。

- enableHighAccuracy —— 如果启用该参数，则通知浏览器启用 HTML5 Geolocation 服务的高精度模式。参数的默认值为 false。如果启用此参数，可能没有任何差别，也可能会导致及其花费更多的时间和资源来确定位置，所以应该谨慎使用。
- timeout —— 可选值，单位为 ms，告诉浏览器计算当前位置所允许的最长时间。如果在这个时间段内未完成计算，就会调用错误处理程序。其默认值为 Infinity，即无穷大或无限制。
- maximumAge： 这个值表示i浏览器重新计算位置的时间间隔。它也是一个 ms 为单位的值。此值默认为 0，这意味着浏览器每次请求时必须立即重新计算位置。

> 提示: *maximumAge 涉及计算位置数据的频率。如果浏览器没有在 maximumAge 设定的时间之内更新过数据，这需要重新获取数据。这里的极限情况：如果将 maximumAge 设置为 “0” 则浏览器在每次请求时都需要重新获取数据，如果将其设置为 Infinity 这意味着不再重新获取数据。*

### 2.重复性的位置更新请求
watchPosition 的使用
```
var watchId = navigator.geolocation.watchPosition(updateLocation, handleLocationError);
// 基于持续更新的位置信息实现一些功能!
// ...
// OK, 现在我们可以停止接收位置更新信息了
navigator.geolocation.clearWatch(watchId);
```

## example ：
该示例周期性计算设备的移动距离，距离计算需要使用 Haversine 公式来实现。

JavaScript 实现的 HaveSine 公式：
```
function toRadians(degree) {
	return degree * Math.PI / 180;
}

function distance(latitude1, longitude1, latitude2, longitude2) {
	// R 地球半径，以 km 为单位
	var R = 6371;
	var deltaLatitude = toRadians(latitude2 - latitude1);
	var deltaLongitude = toRadians(longitude2 - longitude1);
	latitude1 = toRadians(latitude1);
	latitude2 = toRadians(latitude2);
	var a = Math.sin(deltaLatitude / 2) *
		Math.sin(deltaLatitude / 2) +
		Math.cos(latitude1) *
		Math.cos(latitude2) *
		Math.sin(deltaLongitude / 2) *
		Math.sin(deltaLongitude / 2);
	var c = 2 * Math.atan2(Math.sqrt(a),
		Math.sqrt(1 - a));
	var d = R * c;
	return d;
}
```

主要文件：

- odometer.html —— 计算用户位置变化的页面。

## 参考链接

- [W3C Geolocation API Specification][1]
- [Geolocation API 浏览器支持情况][2]



  [1]: http://www.w3.org/TR/geolocation-API/ "W3C"
  [2]: http://caniuse.com/geolocation "caniuse"