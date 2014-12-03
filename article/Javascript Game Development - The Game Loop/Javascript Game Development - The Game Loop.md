# [Javascript Game Development - The Game Loop][1] (译文)

[TOC]

一个 `game engine` 最重要的部分就是所谓的 "`Game loop`"。它是 `game engine` 的核心部分，负责设法平衡运行的游戏逻辑，并执行它的绘图操作。

一个非常基本的 `game loop` 在 `JavaScript` 中看起来先这样(在浏览器中它并没有完成任何工作!)：
```javascript
var Game = { };

Game.draw = function() { ... draw entities here ... };
Game.update = function() { ... run game logic here ... };

while (!Game.stopped) { // While the game is running
  Game.update();        // Update Entities (e.g. Position)
  Game.draw();          // Draw Entities to the Screen
}
```
写一个 `game loop` 使它在浏览器中一点点执行比这更加棘手。我们不能只使用 `while` 循环让它永远执行 `JavaScript` 代码块来让浏览器重绘窗口，从而使 `game` 看起来像被 "`locked-up`(锁定)" 了。
所以我们必须尝试"模拟"一个真正的循环，同时回馈控制浏览器的每个绘制操作后没有锁定接口。

## setInterval 来帮忙
`window.setInterval` 正是我们要寻找的。它提供了一个运行代码的 `loop`，同时在 `loop` 运行之间使浏览器重绘窗口的方法。
```javascript
Game.fps = 50;

Game.run = function() {
  Game.update();
  Game.draw();
};

// Start the game loop
Game._intervalId = setInterval(Game.run, 1000 / Game.fps);

...

// To stop the game, use the following:
clearInterval(Game._intervalId);
```
查看使用 setInterval 的 game loop [示例](setInterval.html)。
## 这样就行了？
嗯，是的。至少为一个基本的 `game` 时。使用这个 `loop` 的主要问题是，`updating` 和 `drawing` 操作"粘合"在一起了(这意味着你 `game` 的逻辑和 `drawing` 操作跑的一样快)。所以，如果你的帧率低于 `60fps`，`game` 的运行速度似乎会较慢。

对于一些游戏，这可能永远是一个问题，对于其他 `game` 这可能导致画面抖动。另外，如果你想制作一个多人游戏，你要确保你的逻辑运行的速度与所有客户端相同。
这可以通过使用所谓的 "[game loop with fixed time steps](http://www.flipcode.com/archives/Main_Loop_with_Fixed_Time_Steps.shtml)" 来实现。基本上，我们尝试在一个固定的时间运行逻辑，并且尝试每一帧都试图重绘。
```javascript
Game.fps = 50;
Game.run = (function() {
  var loops = 0, skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();
  
  return function {
    loops = 0;
    
    while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
      Game.update();
      nextGameTick += skipTicks;
      loops++;
    }
    
    Game.draw();
  };
})();

// Start the game loop
Game._intervalId = setInterval(Game.run, 0);
```
现在，这会给我们一个 `50fps` 的 `game loop`，同时尽可能多的运行 drawing 代码。
这产生了一个非常流畅的动画，每 `5ms` 执行一次 drawing 操作，每 `50ms` 执行一次 `updating` 操作。

查看[示例](fixed_timestep_setInterval.html)
## 更多的问题？！
但是，现在我们面临的另一个问题：我们正在消耗大量的 CPU 周期，实际玩家的动画过于流畅了。大多数计算机屏幕具有 `50` 或 `60 Hz` 的刷新频率，所以每秒 `200` 次的 `drawing` 操作矫枉过正了，并带来了我计算机的 `CPU` 高达 `48%` 的使用率，根据 `Chrome's Task Manager`。
这就是为什么 `Mozilla` 推出了 `window.mozRequestAnimationFrame`(其中 `WebKit` 也有一个 `window.webkitRequestAnimationFrame`) 的方式轻松限制 `drawing` 操作每秒刷新屏幕的次数。(目前，无论 `mozRequestAnimationFrame` 以及 `webkitRequestAnimationFrame` 并没有真正与屏幕刷新率同步，而只是以一个理想的量来限制 `drawing` 操作，但真正的同步最终会执行。)
为了兼容不支持 `*RequestAnimationFrame` 的浏览器，我们必须提供基于 `setInterval` 的回退，限制为 `60FPS`。
```javascript
(function() {
  var onEachFrame;
  if (window.webkitRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(Game.run);
```
这使得保持 `game` 流畅的同时并不会完全消耗 `CPU`(根据 `Chrome Task Manager`，使用这个 `webkitRequestAnimationFrame`，`CPU` 负载在 `10~20%` 之间)。
查看更改后的[示例](fixed_timestep_optimal.html)。

## 一些问题
正如评论中所指出的，`drawing` 操作比 `updating` 操作运行更多次并没有好处(出去一些别的情况)，所以如果没有进行 `updating` 操作你必须跳过 `drawing` 操作或 `interpolate`(插值)。
跳过 `drawing` 操作实际上是很容易实现的，干脆使用一个小条件把 `Game.draw` 环绕起来：
```javascript
if (loops) Game.draw();
```
这可以确保只有运行至少一个 `updating` 操作，我们才会重绘 `game`。

`interpolation` 可能有点困难，因为你必须让所有的 `drawing` 操作意识到 `interpolation`，它会让你的 `drawing` 代码更加复杂。
下面是一个 `interpolation game loop` 的代码：
```javascript
// Updated drawing code for our objects
Rect.prototype.draw = function(context, interpolation) {
  context.fillRect(this.x, this.y + this.velocity * interpolation, 30, 30);
};

Game.draw = function(interpolation) {
  this.context.clearRect(0, 0, 640, 480);

  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].draw(this.context, interpolation);
  }
};

Game.run = (function() {
  var loops = 0, skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime(),
      lastGameTick;

  return function() {
    loops = 0;

    while ((new Date).getTime() > nextGameTick) {
      Game.update();
      nextGameTick += skipTicks;
      loops++;
    }

    if (!loops) {
      Game.draw((nextGameTick - (new Date).getTime()) / skipTicks);
    } else {
      Game.draw(0);
    }
  };
})();
```
现在，如果你打算用 `interpolation`，你应该降低 `game` 运行 `updating` 操作的数量，下降到每秒 `25` 或 `30` 次更新(但不要忘了相应的更新你的对象的移动速度)。

## 参考
- [Javascript Game Development - The Game Loop][1]

[1]: http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html