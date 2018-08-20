# setTimeout 中的 this

> 注意：这里不讨论箭头函数的情况，因为在箭头函数里，this 并不受此影响

首先来看一个例子：
```js
var timeout = setTimeout(function() {
  console.log(this);
}, 0);
```

这段代码简单到你几乎可以不用执行也知道 this 是什么，在浏览器里，这个 `this` === `window`，按照一般的逻辑，这段代码在 node 环境应该是 `this` === `global`，但是实际运行的结果却并不是这样，以下是在 node relp 环境运行的结果：
```
Timeout {
  _called: true,
  _idleTimeout: 1,
  _idlePrev: null,
  _idleNext: null,
  _idleStart: 108023,
  _onTimeout: [Function],
  _timerArgs: undefined,
  _repeat: null,
  _destroyed: false,
  domain: "...",
  [Symbol(asyncId)]: 510,
  [Symbol(triggerAsyncId)]: 6 }
```

事实上，这个 `this` === `timeout`，很奇怪对不对，首先在不看源码的情况下，尝试解释这个问题。
从 `setTimeout(fn, delay, args)` 这个定义来看，其调用的时候有两个参数，fn 和 delay，我能想到的解释是：
```js
let setTimeout = (callback, delay) => {
  return new Timeout(callback, delay);
};
class Timeout {
  constructor(callback, delay) {
    this.callback = callback;
    this.delay = delay;
  }
}
```

当然，以上只是我当时的猜测，从结果反推可能的原因，不过虽然这样可以解释这个现象，在好奇心的驱使下，我还是翻了一遍 node 的源码，其源码主要是以下两部分：

+ https://github.com/nodejs/node/blob/a478259af7671fa2794aa030f7790a9d9772be5e/lib/timers.js  
+ https://github.com/nodejs/node/blob/a478259af7671fa2794aa030f7790a9d9772be5e/lib/internal/timers.js  

从源码确实可以证明我的猜测，当然源码在这一块有比我想的复杂，不过其中的 isRepeat 却引起了我的好奇，带着这个好奇我继续往下看，事实上，setTimeout、setInterval 和 setImmediate 以及与之相对的 clear 都是依赖这个 timer 的。

在浏览器端，一直以来我们都是用 setTimeout 来模拟 setInterval 的，因为使用 setInterval 时，当某次请求等待和执行的超过了指定的 delay，后续的请求都会受影响，导致误差累积。但是在 node 中，我们发现这个误差被消除了，同时为了保证 event loop 不会阻塞，当 setTimeout 为 0 时，会被强制设为 1。

再回到浏览器的 timer 来说，浏览器的 timer 返回的是 timerId，这个 id 是在当前进程下唯一的，以便调用 clear 方法将之清除掉。那么在 node 中为什么要做这个调整，首先这个 id 在 node 中变成了 `[Symbol(asyncId)]` 和 `[Symbol(triggerAsyncId)]`，如果熟悉 node api 的话，或许知道 node 新增了 `Timers.ref()` 和 `Timers.unref()`，从这方面来说，node 确实有必要做这个扩展，因为在服务器端，unref 是必要的，但在浏览器端，则没这个必要。如果有兴趣的话，可以读一下这两个问题的源码，整体看下来也不算太长。

另外，之前一直以为是作用域的问题，现在发现不是，只是作为 callback，直接作为 _onTimeout 追加到 Timer 是否是一个好的设计有智者见智了，不过从我个人写代码的习惯来说，对于 setTimeout 这种，一般习惯用箭头函数，如果非要在里面用到 this，也希望显式的申明这个 this 是指哪个：

```js
let self = this; // 在这几显式的申明一下，或者使用 bind 指定 this
var timeout = setTimeout(function() {
  console.log(self);
}, 0);
```