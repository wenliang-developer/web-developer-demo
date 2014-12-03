# [Main Loop with Fixed Time Steps][1](译文)
[TOC]

大多数 game 要保持一致的游戏速度，不管在在视觉效果上达到怎样的帧速率。鉴于 PC hardware 在性能上疯狂的差异，这不是显而易见的。这里的关键思想是，渲染比游戏逻辑花费更多的时间的假设。
在我们目前的项目中，我们使用一个 fixed timestep scheme(固定的时间步骤的方案)。在过去，我曾使用 variable timesteps(可变时间步骤)工作，并以某种方式回退，来始终保持固定的速度。:-) 在我们的 main game loop 能做得，基本上是：
```javascript
time0 = getTickCount();
do
{
  time1 = getTickCount();
  frameTime = 0;
  int numLoops = 0;

  while ((time1 - time0) >  TICK_TIME && numLoops < MAX_LOOPS)
  {
    GameTickRun();
    time0 += TICK_TIME;
    frameTime += TICK_TIME;
    numLoops++;
// Could this be a good idea? We're not doing it, anyway.
//    time1 = getTickCount();
  }
  IndependentTickRun(frameTime);

  // If playing solo and game logic takes way too long, discard pending time.
  if (!bNetworkGame && (time1 - time0) > TICK_TIME)
    time0 = time1 - TICK_TIME;

  if (canRender)
  {
    // Account for numLoops overflow causing percent  1.
    float percentWithinTick = Min(1.f, float(time1 - time0)/TICK_TIME);
    GameDrawWithInterpolation(percentWithinTick);
  }
}
while (!bGameDone); 
```
让我们来看看主要部分：
```javascript
 while ((time1 - time0) > TICK_TIME && numLoops < MAX_LOOPS)
  {
    GameTickRun();
    time0 += TICK_TIME;
    frameTime += TICK_TIME;
    numLoops++;
    time1 = getTickCount();
  } 
```
这背后的理念是迫使每个 game logic tick 代表一个固定大小的 real-time(real-time 就是你手表显示的时间)。当然 tick 更少的花费 CPU 的执行时间，比使用 real-time。根据记录，variable timestep model 看起来更像是这样：
```
GameTickRun(m1-m0); // 每次 tick 代表的时间的变化量.
time0 = time1; 
```
我不会深入 variable timestep model 的细节和问题。但它给了我们另一大 TOTD(hint,hint)。
想象一下下面的情况：你想让一个球以 10px/s 的速度移动。你有一个 TICK_TIME = 50ms，这意味着每一个 tick，或调用 GameTickRun()，球应该每 tick 移动 0.5px。这样 game 就应该传入 time 到 GameTickRun() 函数中，在函数内部更新球的位置。
不，我们假设渲染每一帧需要 100ms，而更新球的位置不花费时间。这意味着每次进入循环，time1 比 time0 多 100ms，因此
循环将会为每 frame 执行两次渲染(以 10fps)。如果每次渲染需要 50ms(如果你有一个更好的 videocard)，循环只做一次，你会达到 20fps。这两种情况下，你会得到 10px/s 的小球，第二个具有的帧率比第一个更流畅。请记住，我们不是 固定帧率，我们渲染的速度由硬件以及不得不这样做的
运行的 game logic。
事情变得更有趣了，如果我们说，我们可以实现 30fps，所以每个渲染需要 33.333333333ms 即可完成。我们究竟得到什么呢？我们第一次运行循环后渲染，我们发现只过去了 33.333333ms，不足以满足单次 game logic tick(TICK_TIME == 50)。所以我们运行一个 logic tick和渲染一帧。下一次经过的时间就是 66.666666ms，所以我们运行一个 logic tick，并占据了 50ms 的 tick，从而获得 16.666666ms 离开和渲染。接下来 tick 我们有 16.66666 + 33.333333 = 50ms，所以我们运行一个 tick。的到 0ms 的余数。渲染和继续下去...
现实世界的情况是，你的一个快速的 PC game 的帧率随时随地变化在 30~60fps(单击游戏往往试图实现一个恒定的帧率)。
需要关注的是，一连串的 game logic tick 将需要更多的时间来执行，它们代表的不是时间，它就是 MAX_LOOPS，限制 ticks 执行的次数。是的。我们看到这种情况发生很多次了，这就是为什么我添加它。如果你正在玩网络游戏，你通常不能只是减慢 "game time"，除非所有的技巧都这样做，所以你不能使用 MAX_LOOPS 看守(我假定一个 lockstep network model)。
我喜欢 frames(视觉更新)和ticks(game logic updates)之间的分离，是的一切都那么简单。
```javascript
  IndependentTickRun(frameTime); 
```

## 参考

- [Main Loop with Fixed Time Steps][1]

[1]: http://www.flipcode.com/archives/Main_Loop_with_Fixed_Time_Steps.shtml