# Web Storage - REC - 2013.7.30
[TOC]

[Web Storage][1] 规范定义了一个将 `key-value pair` 数据持久化存储到 `Web clients` 的 `API`。

## 简介
该规范引入了两个相关机制，类似于 `HTTP session` 和 `cookie`，用于在客户端存储结构化数据。

第一个机制是专门为以下场景设计的：用户可以在两个不同的窗口购买飞机票 用户正在执行单个事务，但可以同时在不同的窗口进行多个事务。

一些情况下 `Cookies` 不能真正处理好。例如，用户可以在两个不同的窗口购买飞机票，使用相同的网站。如果网站使用 `cookie` 来跟踪用户正在购买哪些票，则当用户点击两个窗口中的一个页面，当前正在购买的飞机票的信息，将从一个窗口 **"泄露"** 到另一个，从而可能导致用户购买了两张同一个航班的票，而且没有真正注意到。

为了解决这个问题，该规范介绍了通过 `sessionStorage` 属性。网站可以将数据添加到 `session storage`，并从该窗口中打开同一个网站的任何页面都可以访问。

*例如，一个页面可能会有一个复选框，存储用户选择：*
```html
<label>
 <input type="checkbox" onchange="sessionStorage.insurance = checked ? 'true' : ''">
 I want insurance on this trip.
</label>
```
*后面的页面可以从脚本中检查，用户是否选择了复选框：*
```javascript
if (sessionStorage.insurance) { ... }
```
*如果用户打开了同一个网站的多个窗口，每一个都有一个独立的 `session storage` 对象。*

-------------------------------

第二种存储机制被设计为 `storage` 可以跨越多个窗口，并且持续的时间超过当前会话。具体的，出于在客户端上为性能考虑的原因，`Web` 应用程序可能希望存储以 `MB` 为单位的用户数据，例如整个用户创作的文档或用户邮箱数据。

同样，`cookies` 不处理这种情况是很好的，因为它们会在每次请求时发送。

所述 `localStorage` 的属性用于访问页面的 `local storage area`。

*站点 `example.com` 可以显示用户加载这个网站页面的次数：*
```javascript
<p>
  You have viewed this page
  <span id="count">an untold number of</span>
  time(s).
</p>
<script>
  if (!localStorage.pageLoadCount)
    localStorage.pageLoadCount = 0;
  localStorage.pageLoadCount = parseInt(localStorage.pageLoadCount) + 1;
  document.getElementById('count').textContent = localStorage.pageLoadCount;
</script>
```
每个网站都有自己独立的 `storage area`。

## API
### Storage interface
```IDL
interface Storage {
  readonly attribute unsigned long length;
  DOMString? key(unsigned long index);
  getter DOMString getItem(DOMString key);
  setter creator void setItem(DOMString key, DOMString value);
  deleter void removeItem(DOMString key);
  void clear();
};
```
每个 `Storage` 对象提供了访问 `key/value pairs` 的 `list`，它有时候也称为 `items`。`key` 是字符串。任何字符串(包括空字符串)都是一个有效的 `key`。`value` 同样是一个字符串。

每个 `Storage` 对象在创建时与 `key/value pairs list` 相关联。如本节中定义的 `sessionStorage` 和 `localStorage` 属性。多个实现 `Storage` 接口的对象都可以同时与同一个 `key/value pairs list` 相关联。

**length** 属性必须返回目前与对象相关联的 `list` 中的 `key/value pairs` 的数量。

**key(*n*)** 方法必须返回在 `list` 中第 *n* 个项的名称，`key` 的顺序可以由 `user agents` 定义，但只要 `key` 的数量不发生改变，就必须与该对象内部保持一致(因此，在添加或删除 `key` 可以改变 `key` 的顺序，但仅仅不能改变现有 `key` 的 `value`)。如果 *n* 大于或等于 `key/value pairs` 的数量，则这个方法必须返回 `null`。

**supported property names** 是与一个 `Storage` 对象相关联的 `list` 的每个 `key/value pairs` 的 `keys`。

**getItem(*key*)** 方法必须返回与给定 *key* 相关联的当前 `value`。如果给定的 *key* 不存在于与 `list` 相关联的对象中，则本方法必须返回 `null`。

**setItem(*key*, *value*)** 方法必须先检查给定 *key* 的 `key/value pairs` 是否已经存在于与 `list` 相关联的对象中。

 - 如果不存在，那么一个新的 `key/value pairs` 必须添加到 `list` 中，用给定的 *key*，`value` 设置为 *value*。
 - 如果给定的 *key* 确实存在于 `list` 中，那么它必须将对应的 `value` 更新为 *value*。
 - 如果它不能设置新的 `value`，该方法必须抛出 `QuotaExceededError` `exception`。(若设置失败，例如，用户禁用该网站的 `storage`，或者如果已经超出配额。)

**removeItem(*key*)** 方法，必须将给定 *key* 的 `key/value pairs`，从与 `list` 相关联的对象中删除，若它存在。如果与 *key* 相关联的 `item` 不存在，该方法什么都不做。

**setItem()** 和 **removeItem()** 方法相对于 `failure` 必须是 `atomic`(原子)。在出现 `failure` 的情况下，该方法不执行任何操作。也就是说，更改 `data storage area` 必须是成功的，或 `data storage area` 不能发生任何更改。

**clear()** 方法必须以 `atomically`(原子方式) 引发，清空与 `list` 相关联对象的所有 `key/value pairs`。如果不不存在任何 `key/value pairs`，该方法什么都不做。

> Note：当 **setItem()**，**removeIte()** 和 **clear()** 方法被调用时，其他 `Document` 对象会触发事件，可以访问新的 `stored` 或移除数据，例如本节定义的 `sessionStorage` 和 `localStorage` 属性。

> Note：该规范并不要求上述方法等待直到数据写入物理磁盘中。只有不同的脚本一致的访问相同的底层 `key/value pairs list` 是必须的。

### sessionStorage attribute
```javascript
[NoInterfaceObject]
interface WindowSessionStorage {
  readonly attribute Storage sessionStorage;
};
Window implements WindowSessionStorage;
```
**sessionStorage** 属性表示特定于当前 `top-level browsing context` 的 `storage areas` 集(the set of storage areas)。

每一个 `origin` 的每一个 `top-level browsing context` 都有一组唯一的 `sessions storage areas set`。

`user agents` 不能让一个 `browsing context` 的 `session storage areas` 的数据失效，但也可以这样做，当用户请求删除这些数据，或者在 `UA` 检测到它的存储空间受到限制，或出于安全原因时。`user agents` 应该避免删除数据和访问数据的脚本同时运行。当一个 `top-level browsing context` 被破坏(并且因此用户永远无法访问的)存储在 `session storage areas` 中的数据能够随着它被丢弃。正如在本规范中所描述的 `API` 无法提供对 `session storage` 在随后被检索的功能(即在关闭窗口以后)。

> Note：`browser context` 的生命周期可能与实际的 `user agent` 进程本身的生命周期无关，因为 `user agent` 可能会支持在重新启动后恢复会话。

当一个新的 **Document** 在一个 `browser context` 中被创建(它是一个 top-level browser context)，`user agents` 必须检查，`top-level browser context` 是否有一个为该 `document's origin` 的 `session storage area`。如果有，那么这就是为 **Document** 分配的 `session storage area`。如果没有，必须创建一个为 `document's origin` 的新的 `storage area`，然后分配给 **Document** 的 `session storage area`。在 **Document** 的生命周期中 **Document** 指定的 `storage area` 不会发生改变，即使是在一个嵌套的 `browser context`(例如，在一个 **iframe**)情况下，被移动到另一个 `parent browser content` 中。

**sessionStorage** 属性必须返回分配给 **Document** 的 `session storage area` 相关联的 **Storage** 对象，如果有的话，如果没有，则返回 `null`。每个 **Document** 对象必须具有一个单独的对象，它是 **Window** 对象的 **sessionStorage** 属性。

当一个新的 `top-level browser context` 通过克隆现有 `browser context` 创建，则新的 `browser context` 必须以相同的 `session storage area` 作为 `original` (这里翻译为：原始值)，当两个集合必须从这一刻起相互独立，互不影响，在任何情况下。

当一个新的 **top-level browser context** 是由一个脚本通过现有 `browser context`，或者由用户按照现有 `browser context` 的 `link` 创建，或以某种其他方式涉及特定的 **Document**，那么该 **Document** 的 `origin` 的 `session storage area` 必须在创建时复制到新的 `browser context`。从这一点上，但是，这两个 `session storage area` 必须被认为是独立的，互不影响的，以任何方式。

当 **setItem()**，**removeItem()** 和 **clear()** 方法被与 `session storage area` 相关联的 **Storage** 对象 *x* 调用时，如果方法做了某些操作，那么每个 **Document** 对象的 **Window** 对象的通过相同 `session storage area` 相关联的代表 **Storage** 对象的 **sessionStorage** 属性，除了 *x* 以外，**storage** `event` 必须被触发。

### localStorage
```IDL
[NoInterfaceObject]
interface WindowLocalStorage {
  readonly attribute Storage localStorage;
};
Window implements WindowLocalStorage;
```
*localStroage* 对象提供一个为 `origin` 的 **Storage** 对象。

`user agents` 必须使每一个 `origin` 都有一个 `local stroage areas set`。

`user agents` 应当仅在  出于安全方面的原因或用户请求这样做，才可以使 `local storage area` 的数据失效。`user agents` 应该始终避免同时访问数据和删除数据的脚本运行。

当访问 **localStorage** 属性时，`user agent` 必须执行以下步骤，这是已知的 Storage 对象的初始化步骤：

 1. 如果请求违反了决策(例如，如果 `user agent` 被配置为不允许页面数据持久化)，则 `user agent` 可以抛出一个 **SecurityError** `exception` 而不是返回一个 **Storage** 对象。
 2. 如果 **Document** 的 `origin` 与 `scheme/host/port` 不匹配，则抛出一个 **SecurityError** `exception` 并跳过这些步骤。
 3. 检查，查看 `user agent` 是否已经分配一个为 `origin` 的 `local storage area` 到 **Document** 的 **Window** 对象的可访问的属性上。如果没有，创建一个为该 `origin` 的新的 `storage area`。
 4. 返回与 `origin` 的 `local storage area` 相关联的 **Storage** 对象。每个 **Document** 必须具有一个独立的对象，它是 **Window** 的 `localStorage` 属性。

当 **setItem()**，**removeItem()** 和 **clear()** 方法被与 `session storage area` 相关联的 **Storage** 对象 *x* 调用时，如果方法做了某些操作，那么每个 **Document** 对象的 **Window** 对象的通过相同 `local storage area` 相关联的代表 **Storage** 对象的 `localStorage` 属性，除了 *x* 以外，**storage** `event` 必须被触发。

### storage event
**storage** `event` 是在 `storage area` 发生变化时触发的(`session storage` 和 `local storage` 中有描述)。

发生这种请求时，`user agent` 必须将一个触发 **storage** `event` 的任务排入队列中，它是不会冒泡且不可取消的事件，它使用 **StorageEvent** 接口，在每个 **Window** 对象，它的 **Document** 对象的 **Storage** 对象会受到影响。

> Note：这包括 **Document** 对象没有完全 *fully active*(完全激活)，但触发的 `event` 被 `event loop` 忽略，直到 `Document` 再度处于 *fully active* 状态。

如果事件是由于调用 **setItem()** 或 **removeItem()** 被触发，`event` 必须具有其 **key** 属性，初始化为涉及的 `key` 的名称。它的 **oldValue** 属性，初始化为对应 `key` 的原来的 `value`，如果 `key` 是被新添加的则为 `null`，其 **newValue** 属性初始化为 `key` 的性质，如果移除 `key` 则为 `null`。

否则，如果事件是由于调用 **clear()** 方法触发，`event` 必须具有 **key** 属性，**oldValue** 和 **newValue** 属性初始化为 `null`。

此外，`event` 必须具有其 **url** 属性，初始化为其受到影响的 **Storage** 对象的 `document` 的地址；及其 **storageArea** 属性被初始化为一个 **Storage** 对象，来自于受到影响的 **Storage** `area`(即 session 或 local) 的 `target` **Document** 的 **Window** 对象。

#### Event definition
```IDL
[Constructor(DOMString type, optional StorageEventInit eventInitDict)]
interface StorageEvent : Event {
  readonly attribute DOMString key;
  readonly attribute DOMString? oldValue;
  readonly attribute DOMString? newValue;
  readonly attribute DOMString url;
  readonly attribute Storage? storageArea;
};

dictionary StorageEventInit : EventInit {
  DOMString key;
  DOMString? oldValue;
  DOMString? newValue;
  DOMString url;
  Storage? storageArea;
};
```
**key** 属性必须返回其初始化的值，当创建对象时，该属性必须被初始化为空字符串。它代表被改变的 `key`。

**oldValue** 属性必须返回其初始化的值。当创建对象时，该属性必须被初始化为 `null`，它代表了被改变的 `key` 以前的 `value`。

**newValue** 属性必须返回其初始化的值。当初始化对象时，该属性必须被初始化为 `null`。它代表了被改变的 `key` 的新 `value`。

**url** 属性必须返回其初始化的值，但初始化对象时，该属性必须被初始化为空字符串。它代表了被改变的 `key` 的 `document` 的地址。

**stroageArea** 属性必须返回其初始化的值。当创建对象时，该属性必须被初始化为 `null`。它表示受到影响的 **Storage** 对象。


 
[1]: http://www.w3.org/TR/webstorage/ "Web Storage W3C Recommendation 30 July 2013"


  
 