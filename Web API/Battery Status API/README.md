# Battery Status API(电池状态 API)
[TOC]

人们使用移动设备浏览网页的数量日益增加。这也使得合理优化网站和 Web 应用程序，以此来适应移动用户变得尤为重要。W3C 很清楚这一趋势，并推出了一些 API 来帮助我们完成这些挑战。本文将介绍这些 API 的其中一个：[Battery Status API][W3C WD]。

##简介
当前移动设备最烦人的一个限制，是电池有限的续航时间。当远行时，因为电量不足而意外退出，这都让人发疯。无论现代智能手机如何小巧方便，你都要记住携带适配器(充电宝)为你的手机或者平板电脑充电。
作为开发人员，我们可以帮助解决这个问题，但我们通常喜欢忽略它。直到最近，开发人员都有一个很好的借口：因为没有一个 API 能够获取设备的电池状态。这个借口因为引入了 [Battery Status API][W3C WD] 不再有效。让我们花几分钟来探索 Battery Status API 吧。
## 它是什么？
Battery Status API,有时也称为 Battery APi，提供了相关系统的电池电量信息。它还定义了电池电量或状态发生变化时触发的事件。尽管 Battery Status API 是 W3C 候选推荐标准，但是该 [规范 - 2012.5][W3C CR] 至 2012 年 5 月就没有更改过，因此很可能当前 API 在未来不会发生大的变化。
开发人员可以利用该 API 完成一些操作。例如，当检测到电池电量不足或严重不足时，Web 应用程序可能会从一个长期运行的过程暂时停顿。由开发人员决定在什么时候向用户给出电池电量和情况。
这可能打断了用户，但是通过事先主动通知能够防止数据的丢失等问题。如果你正在开发用于管理内容的应用程序，那么它对会当电池电量不足时频繁保存用户数据非常有用。你的用户会感谢你。丢失数据往往发生在电池没电时。
虽然看起来有点牵强，但它甚至可以在电量不足时，切换屏幕亮度，以此让屏幕从电池中汲取更少的功率，并可能导致电池能够多用几分钟。
我希望你能够明确的通过设备电池电量的通知来采取一些预防措施。现在我们来看看 Battery Status API。

> 注意：Battery Status API 发布了一个 [工作草案 - 2014.8][W3C WD]，实现方式上面提到的 [候选推荐规范-2012.5][W3C CR] 有很大不同。除非特别提及，下面的示例都是以 2012.5 发布的候选推荐标准为基础。

## JavaScript API 的实现方式
Battery Status API 是通过只读的 `window.navigator.battery` 对象的属性得以实现的。

### NavigatorBattery Interface
```
[NoInterfaceObject]
interface NavigatorBattery {
    readonly attribute BatteryManager battery;
};
Navigator implements NavigatorBattery;
```
### BatteryManager Interface
```
[NoInterfaceObject]
interface BatteryManager : EventTarget {
    readonly attribute boolean   charging;
    readonly attribute double    chargingTime;
    readonly attribute double    dischargingTime;
    readonly attribute double    level;
    [TreatNonCallableAsNull]
             attribute Function? onchargingchange;
    [TreatNonCallableAsNull]
             attribute Function? onchargingtimechange;
    [TreatNonCallableAsNull]
             attribute Function? ondischargingtimechange;
    [TreatNonCallableAsNull]
             attribute Function? onlevelchange;
};
```
BatteryManager 对象的属性：

- `charging` —— 一个 boolean 值，指定电池是否在充电。如果该装置不具有电池或该值不能确定，该属性的值为 `true`。
- `chargingTime` —— 一个 number，指定电池充满电需要的剩余时间，单位为秒数。如果电池已经充满电或该装置不具有电池，则该属性为 `0`。如果设备没有在充电，或者它无法确定剩余时间，则该值为 `Infinity`。
- `dischargingTime` —— 一个 number，表示电池电量耗尽所需的时间，单位为秒。如果时间不能确定或电池正在充电，则该值被设置为 `Infinit`。如果设备不具有电池，该值也为 `Infinity`。
- `level` —— 一个 number，指定所述电池的当前等级。该值被返回为 float 范围从 `0`(放完电)到 `1`(充满电)。如果电池的当前等级不能确定、电池充满电或设备不具有电池，这该值为 `1`。

该规范的 `chargingTime` 属性出乎我的意料。直到电池完全充满电和完全放完电，都不是一个秒数。
使用 Battery Status API 时请记住这一点。

Battery Status API 允许我们监听四个事件，每一个都映射 到 `window.navigator.battery` 一个属性的变化：

- `chargingchange` 当设备的充电器被激活或停用时被触发。
- `chargingtimechange` 的剩余充电事件发生变化时触发。
- `dischargingtimechange` 在电池完全放完电的剩余时间内的变化，将触发它。
- `levelchange` 当电池电量发生变化是触发。

你需要为 `window.navigator.battery` 监听上述事件。让我们来看一个例子。
```
navigator.battery.addEventListener('levelchange', function(event) {
   // Do something...
});
```
Battery Status API 的可用事件为开发人员改变网站和 Web 应用程序的行为提供了很大的灵活性。如何判断它是否支持了？这是一个很好的问题。

## support:
检测 Battery Status API 是非常容易的。不过，我们会在下一节讨论浏览器的兼容性。看看下面的代码片段：
```
if (window.navigator && window.navigator.battery) {
   // Grab the battery's information!
} else {
   // Not supported
}
```

browser      | version
---------    | -----
Chrome | 38+
IE (limited) | NO
Firefox | 30+
Chrome for Android | 39+
iOS Safari | NO
Android Browser | NO
UC Browser for Android | 9.9+
Opera Mini | NO
Safari | NO
Opera | 25+
IE Mobile (limited) | NO
Firefox for Android | 33+

## 浏览器兼容性
Battery Status API 还没有得到很好的支持。截至今日，Firefox 唯一一个无需供应商前缀的浏览器。

## example 
本节将使用一个简单的示例，来向你展示如何使用 Battery Status API，并演示了它的一些关键特性。示例中，包含了一个 `id` 为 `bt-results` 的 `div` 用于展示从设备的电池中检索到的数据。这个元素默认隐藏且仅当浏览器支持 Battery Status API 才会显示。示例还包含 `id` 为 `log` 的 `div` 用于记录 Battery Status API 触发的事件。
JavaScript 代码，第一行检测浏览器是否支持 Battery Status API。如果检测失败，显示消息 “API not supported”。否则，我们将监听 Battery Status API 所有的事件。
```
<!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta name="author" content="Aurelio De Rosa">
      <title>Battery Status API Demo by Aurelio De Rosa</title>
      <style>
         *
         {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
         }
 
         body
         {
            max-width: 500px;
            margin: 2em auto;
            padding: 0 0.5em;
            font-size: 20px;
         }
 
         h1
         {
            text-align: center;
         }
 
         .hidden
         {
            display: none;
         }
 
         .bs-info
         {
            font-weight: bold;
         }
 
         #log
         {
            height: 200px;
            width: 100%;
            overflow-y: scroll;
            border: 1px solid #333333;
            line-height: 1.3em;
         }
 
         .button-demo
         {
            padding: 0.5em;
            margin: 1em;
         }
 
         .author
         {
            display: block;
            margin-top: 1em;
         }
      </style>
   </head>
   <body>
      <h1>Battery Status API</h1>
      <span id="bs-unsupported" class="hidden">API not supported</span>
 
      <div id="bt-results" class="hidden">
         <h3>Current Status</h3>
         <div id="bs-status">
            <ul>
               <li>Is battery in charge? <span id="in-charge" class="bs-info">unavailable</span></li>
               <li>Battery will be charged in <span id="charging-time" class="bs-info">unavailable</span> seconds</li>
               <li>Battery will be discharged in <span id="discharging-time" class="bs-info">unavailable</span> seconds</li>
               <li>Current battery level: <span id="battery-level" class="bs-info">unavailable</span>/1</li>
            </ul>
         </div>
      </div>
 
      <h3>Log</h3>
      <div id="log"></div>
      <button id="clear-log" class="button-demo">Clear log</button>
 
      <small class="author">
         Demo created by <a href="http://www.audero.it">Aurelio De Rosa</a>
         (<a href="https://twitter.com/AurelioDeRosa">@AurelioDeRosa</a>)
      </small>
 
      <script>
         window.navigator = window.navigator || {};
         navigator.battery = navigator.battery ||
                             null;
         if (navigator.battery === null) {
            document.getElementById('bs-unsupported').classList.remove('hidden');
         } else {
            var log = document.getElementById('log');
 
            document.getElementById('bt-results').classList.remove('hidden');
            function updateInfo(event) {
               if (event !== undefined) {
                  log.innerHTML = 'Event "' + event.type + '" fired<br />' + log.innerHTML;
               }
               document.getElementById('in-charge').innerHTML = (navigator.battery.charging ? "Yes" : "No");
               document.getElementById('charging-time').innerHTML = navigator.battery.chargingTime;
               document.getElementById('discharging-time').innerHTML = navigator.battery.dischargingTime;
               document.getElementById('battery-level').innerHTML = navigator.battery.level;
            }
 
            var events = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange'];
            for (var i = 0; i < events.length; i++) {
               navigator.battery.addEventListener(events[i], updateInfo);
            }
            updateInfo();
 
            document.getElementById('clear-log').addEventListener('click', function() {
               log.innerHTML = '';
            });
         }
      </script>
   </body>
</html>
```
## 总结
在这篇文章中，我们讨论了 Battery Status API。正如我们所看到的，它非常简单，为开发人员提供了提高网站和 Web 应用程序的用户体验的机会。Battery Status API 有四个属性，并且我们可以监听设备电池状态变化的四个事件来改变网站和 Web 应用程序的行为。不幸的是，支持该 API 的唯一浏览器是 Firefox。不过，我们可以期待在不久的将来广泛采用。这意味着你可以在它得到广泛支持的时候将它用在你的下一个项目中。

## 参考链接

- [HTML5: Battery Status API][1]
- [Battery Stats API 浏览器支持性][2]
- [Battery Status API - W3C WD - 2014.08.28][W3C WD]
- [Battery Status API - W3C CR - 2014.05.08][W3C CR]
- [MDN Battery Status API][3]



  [1]: http://code.tutsplus.com/tutorials/html5-battery-status-api--mobile-22795
  [2]: http://caniuse.com/battery-status "caniuse"
  [3]: https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API "MDN Battery Status API"
  [W3C CR]: http://www.w3.org/TR/2012/CR-battery-status-20120508/ "Battery Status API W3C Candidate Recommendation 08 May 2012"
  [W3C WD]: http://www.w3.org/TR/battery-status/ "Battery Status API W3C Last Call Working Draft 28 August 2014"