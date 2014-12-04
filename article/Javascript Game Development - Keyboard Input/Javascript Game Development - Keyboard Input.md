# [Javascript Game Development - Keyboard Input][1](译文)

现在，当我们有了一个基本的 [game loop][2]，就可以专注于基于 JavaScript game 的其他方面。这片文章想你展示我是怎样处理键盘输入的。

##Keyboard Events
如果你以前在 `Web` 开发中使用过 `JavaScript`，你很可能知道当一个按键被按下时 `keydown` 和 `keyup` event 会在浏览器中触发。

比如说，我们要创建一个 `game`，玩家控制一个小的黑色矩形，可以在一个很大的区域内移动它(非常复杂的，我知道了！)。

首先，我们需要的是表示 `player` 对象的类：
```javascript
function Player() {
  this.x = 0;
  this.y = 0;
}

Player.prototype.draw = function(context) {
  context.fillRect(this.x, this.y, 32, 32);
};

Player.prototype.moveLeft = function() {
  this.x -= 1;
};

Player.prototype.moveRight = function() {
  this.x += 1;
};

Player.prototype.moveUp = function() {
  this.y -= 1;
};

Player.prototype.moveRight = function() {
  this.y += 1;
};
```
接下来，我们对 `player` 类的实例 `hook up` 到我们现有的 `game` 代码中。
```javascript
Game.start = function() {
  ...
  
  Game.player = new Player();
  
  ...
};

Game.draw = function() {
  ...
  
  Game.player.draw(Game.context);

  ...
};
```
最后，我们需要设置我们的 `event handling code`：
```javascript
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // Left
      Game.player.moveLeft();
    break;

    case 38: // Up
      Game.player.moveUp();
    break;

    case 39: // Right
      Game.player.moveRight();
    break;

    case 40: // Down
      Game.player.moveDown();
    break;
  }
}, false);
```
[第一个版本](version_1.html)可以工作，但它相当不连贯，并且永远只适用于一个 `key`。为什么呢？

出现抖动是由于这样的事实，`keydown event` 重复触发，在每一个 `event` 之间会有一个小停顿，并且这些停顿不会同步到我们的 `game update code`。所以，我们必须想出一个办法，让它们同步。

永远只有一个 `key` 的问题来自于，浏览器永远只能重复最后一个 `key` 的 `keydown event` 的事实。

围绕这两个问题工作，我们用这个超级简单的辅助对象：
```javascript
var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};
```
你可以将其 `hook up` 到 `keydown` 和 `keyup` 这样的事件：
```javascript
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
```
这个对象跟踪基于浏览器触发的 `keydown/keyup` event 单个按键的按键状态。使用它，我们就可以在我们的 `game update code` 中很容易的检查某个特定 `key` 是否按下。

现在我们添加功能到 `Player` 类：
```javascript
Player.prototype.update = function() {
  if (Key.isDown(Key.UP)) this.moveUp();
  if (Key.isDown(Key.LEFT)) this.moveLeft();
  if (Key.isDown(Key.DOWN)) this.moveDown();
  if (Key.isDown(Key.RIGHT)) this.moveRight();
};
```
然后，我们我们只需要 `hook up` 到 `Game.update` 方法：
```javascript
Game.update = function() {
  ...
  Game.player.update();
  ...
};
```
查看[最终版本](version_2.html)。

[1]: http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
[2]: http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html