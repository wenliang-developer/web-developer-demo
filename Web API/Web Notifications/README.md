# Web Notifications

browser      | version
---------    | -----
Chrome | 31+
IE (limited) | NO
Firefox | 30+
Chrome for Android | NO
iOS Safari | NO
Android Browser | NO
UC Browser for Android | NO
Opera Mini | NO
Safari | 6.1+
Opera | 25+
IE Mobile (limited) | 10+
Firefox for Android | 33+

`Web notifications` 定义了终端用户通知的 `API`。一个通知允许 `alert` 发生在用户当前 `Web` 页面以外的的上下文中，例如 `email` 的交付。

## 介绍 
本规范提供了一个 `API` 来显示通知到网页的上下文之外提醒用户。他没有明确指定一个 `User agents` 如何显示这些通知；最佳的呈现方式取决于 User agents 运行的设备。在本说明书中是指 "`desktop`(桌面)" 上显示通知，它一般是指一个 `Web` 页面之外的一些静态显示区域，但也可以采取多种形式，包括：

 - 用户显示区域的一个角落。
 - `user agent` 边框(chrome)内的一个区域。
 - 移动设备的 "`home`" 屏幕。
 
本规范没有准确定义 `user agents` 如何显示通知并且 `API` 被设计为一个相对而灵活的展示方式。

本规范被设计成尽可能与现有的通知平台相兼容，但它是与平台无关的。由于常见平台不提供相同的功能，该规范指示哪些事件是保证的，哪些不是。具体的，规定通知在这里只可以包含文本和图标的内容。

在一般情况下，对于通知的 `event model` 尽力而为；而 `Notification` 对象提供了一个 `click` 事件，应用程序可以通过监听该事件增强它们的功能，但不能依赖接收该事件，如果底层的通知平台不提供该功能。

## Model
一个通知允许 `alert` 发生在用户网页上下文之外的页面。例如 `email` 的交付。
每个通知都有一个 `title`，`direction`(语言的阅读方式)，`language` 和 `origin`。
每个通知可以具有相关联的 `body`，`tag`，`icon URL` 和 `icon`。'
## Permission
只有以获取用户(或 `user agents`) `permission`(权限) 通知才能够显示。显示通知对于 `origin` 给定的 `permission` 可以是三个字符串之一：

 - **"default"**
    这相当于"被拒绝"，当用户迄今为止还没有做出明确的选择。
 - **"denied"**
    这意味着用户不希望通知。
 - **"granted"**
    这意味着通知可以显示出来。


## API
通知是有一个 `Notification` 对象表示的，可以通过他的构造函数来创建：
```IDL
[Constructor(DOMString title, optional NotificationOptions options)]
interface Notification : EventTarget {
  static readonly attribute NotificationPermission permission;
  static void requestPermission(optional NotificationPermissionCallback callback);

  attribute EventHandler onclick;
  attribute EventHandler onshow;
  attribute EventHandler onerror;
  attribute EventHandler onclose;

  readonly attribute NotificationDirection dir;
  readonly attribute DOMString lang;
  readonly attribute DOMString body;
  readonly attribute DOMString tag;
  readonly attribute DOMString icon;

  void close();
};

dictionary NotificationOptions {
  NotificationDirection dir = "auto";
  DOMString lang = "";
  DOMString body;
  DOMString tag;
  DOMString icon;
};

enum NotificationPermission {
  "default",
  "denied",
  "granted"
};

callback NotificationPermissionCallback = void (NotificationPermission permission);

enum NotificationDirection {
  "auto",
  "ltr",
  "rtl"
};
```
**Notification(*title*, *options*)** 构造函数必须执行这些步骤：

 1. 设 *notification* 是一个 `Notification` 对象，表示一个新的通知。
 2. 设置 *notification* 的 `title` 是 *title*。
 3. 设置 *notification* 的 `direction` 是 `option` 的 **dir**。
 4. 如果 *option* 的 **lang** 是一个有效的 `BCP47` 语言标记，或空字符，设置 *notification* 的 `language` 为 `options` 的 **lang**，否则设置为空字符串。
 5. 设置 *notification* 的 `origin` 为当前的 `origin`。
 6. 如果 *option* 的 **body** 存在，设置 *notification* 的 `body` 为 **body**。
 7. 如果 *option* 的 **tag** 存在，设置 *notification* 的 `tag` 为 **tag**。
 8. 如果 *option* 的 **icon** 存在，以入口 `script` 的 `URL` 为基础解析 **icon**，如果请求成功，设置 *notification* 的 `icon URL` 为返回值(否则 `icon URL` 未设置)。
 9. 返回 *notification*，但不断一步运行这些步骤。
 10. 如果通知平台支持 `icons`，并且 `icon URL` 被设置，`user agents` 可以开始获取 *notification* 的 `icon URL`。
 11. 运行 *notification* 的 **show steps**。

静态 **requestPermission(*callback*)** 方法必须运行这些步骤：

 1. Return，但仍继续异步运行这些步骤。
 2. 设 *permission* 是 permission。
 3. 如果 *permission* 为 **"default"**，询问用户当前 origin 显示通知是否可以接受。如果是，设置 *permission* 为 **"granted"**，否则为 **"denied"**。
 4. 排入一个任务设置 permission 为 *permission*，如果 `callback` 给出，调用 `callback` 传入 *permission* 作为参数。

一下是事件处理程序(及其相应的时间处理程序的事件类型)必须支持的 `Notification` 对象的属性。
| event handler | event handler event type |
| ------------- | ------------------------ |
| onclick       | click                    |
| onshow        | show                     |
| onerror       | error                    |
| onclose       | close                    |

**close()** 方法必须运行通知的 `close steps`。
**dir** 属性必须返回通知的 `direction`。
**lang** 属性必须返回通知的 `language`。
**body** 属性必须返回通知的 `body` 否则返回空字符串。
**tag** 属性必须返回通知的 `tag` 否则返回空字符串。
**icon** 属性必须返回通知的 `icon URL`，`serialized`，否则返回空字符串。

## 参考文献

- [Web Notifications - WD - 2013.9.12][1]
- [Web Notifications 浏览器支持][2]
- [An Introduction to the Web Notifications API][3]
 
  [1]: http://www.w3.org/TR/notifications/ "Web Notifications W3C Last Call Working Draft 12 September 2013"
  [2]: http://caniuse.com/notifications
  [3]: http://www.sitepoint.com/introduction-web-notifications-api/
  
 