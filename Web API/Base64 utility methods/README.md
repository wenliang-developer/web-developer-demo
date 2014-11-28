# Base64 encoding and decoding (Base64 编码和解码)
[TOC]

`atob()` 和 `btoa()` 方法允许我们对 `Base64` 解码和编码。

## JavaScript 是如何实现的？
### WindowBase64 interface
```
[NoInterfaceObject, Exposed=(Window,Worker)]
interface WindowBase64 {
  DOMString btoa(DOMString btoa);
  DOMString atob(DOMString atob);
};
Window implements WindowBase64;
```
> **Note:** 这个 API 有一个助记法： “`b`” 可以被认为是代表 “`binary`(二进制)”，而 “`a`” 这代表 “`ASCII`”。在实践中，出于历史原因，这些函数的输入和输出都是 `Unicode` 字符串。




## API 介绍
### *result = window . btoa( data )*
`data` 参数是每个字符范围在 `U+0000 ~ U+00FF` 的 `Unicode` 字符串。每个值在 `0x00 ~ 0xFF` 的二进制字符串，将被分别转换为它的 `Base64` 表示，然后返回。

如果输入字符串包含任何超出范围的字符，则抛出 `InvalidCharacterError`。

### *result = window . atob( data )*
`data` 为一个以 `Unicode` 字符串形式的包含 `Base64` 编码的二进制数据。对每个值在 `0x00 ~ 0xFF` 范围内的二进制字节的转化为对应的二进制字符串，返回的字符串中的每个字符范围在 `U+000 ~ U+00FF`。

如果输入的字符串是无效的 `Base64` 数据，会抛出一个 `InvalidCharacterError` 异常。


> **Note:** 这个 WindowBase64 interface 添加到 Window interface 和 WorkerGlobalScope interface (Web workers 的一部分)。

如果 `btoa()` 方法的参数中包含的如何字符的对应编码大于 `U+00FF`，会抛出一个 `InvalidCharacterError` 异常。开发人员必须按顺序将参数中的每个字符转换成对应的8-bit 字节序列，然后将 `base64` 算法应用到这个 `8-bit` 序列，并返回结果。

`atob()` 方法必须按一下步骤解析传入到该方法的第一个字符串：

 1. 传入需要被解析的 `input` 字符串。
 2. 将一个指针指向 `input` 字符串的开始位置。
 3. 删除 `input` 字符串的所有空格字符。
 4. 如果 `input` 的 `byte` 长度除 `4` 余 `0`，则：如果 `input` 结尾含有一个或两个 `U+003D(=)` 字符，将从 `input` 中删除它们。
 5. 如果 `input` 的 `byte` 长度除 `4` 余 `1`，这抛出一个 `InvalidCharacterError` 异常，并跳过下面的步骤。
 6.  如果 `input` 中包含的字符，不在下面列表的字符范围内，则抛出一个 `InvalidCharacterError` 异常，并逃过下面的步骤:
    - `U+002B` 加号(+)
    - `U+002F` (/)
    - 字母和数字的 `ASCII` 字符。
 7. 初始化一个空的 `output`。
 8. 初始化一个空的 `buffer`，使其可以有一个填入 `bit` 的区域。
 9. 如果当前指针，没有指向 `input` 最后的位置，则运行一下步骤：
    
    1. 获取输入的当前指针指向的字符，在**Base64编码表**中对应的编码。
    2. 编码对应一个 `6-bits` 数字。并追加到 `buffer`。 
    3. 如果 `buffer` 已累积了 `24-bits`，将其解释为 `3 * 8-bits` 数字。以同样的顺序添加到 `output` 的三个字符的二进制编码等于这些数字。然后清空 `buffer`。
    4. 将指针移动到下一个字符位置。

 10. 如果 `buffer` 不为空，它包含 `12-bits` 或 `18-bits`。如果它包含 `12-bits`，这丢弃最后的 `4` 个` bits`，将其解释为 `1 * 8-bits`。如果包含 `18-bits`，这丢弃最后两个 `bits`，将其解释为 `2 * 8-bits`。以同样的顺序添加到 `output` 的一个或两个字符的二进制编码等于这些 `buffer` 丢弃 `bits` 的数字。
 11. return `output`。
```
//Base64 编码表：

0	A   	    16	Q   	    32	g   	    48	w
1	B   	    17	R   	    33	h   	    49	x
2	C   	    18	S   	    34	i   	    50	y
3	D   	    19	T   	    35	j   	    51	z
4	E   	    20	U   	    36	k   	    52	0
5	F   	    21	V   	    37	l   	    53	1
6	G   	    22	W   	    38	m   	    54	2
7	H   	    23	X   	    39	n   	    55	3
8	I   	    24	Y           40	o   	    56	4
9	J   	    25	Z   	    41	p   	    57	5
10	K   	    26	a   	    42	q   	    58	6
11	L   	    27	b   	    43	r   	    59	7
12	M   	    28	c   	    44	s   	    60	8
13	N   	    29	d   	    45	t   	    61	9
14	O   	    30	e   	    46	u   	    62	+
15	P   	    31	f   	    47	v   	    63	/
```

## 小技巧：对 Unicode 字符串编码
在各浏览器中，使用 `window.btoa` 对 `Unicode` 字符串进行编码都会触发一个 `InvalidCharacterError`(字符越界) 的异常。

先把 `Unicode` 字符串转换为 `UTF-8` 编码，可以解决这个问题：
```js
function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}

function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}

// Usage:
utf8_to_b64('? à la mode'); // "4pyTIMOgIGxhIG1vZGU="
b64_to_utf8('4pyTIMOgIGxhIG1vZGU='); // "? à la mode"

//译者注:在js引擎内部,encodeURIComponent(str)相当于escape(unicodeToUTF8(str));
//所以可以推导出unicodeToUTF8(str)等同于unescape(encodeURIComponent(str));
```

## 参考链接

- [MDN window.atob][1]
- [MDN window.btoa][2]
- [Base64 encoding and decoding 浏览器支持性][3]
- [WHATWG - Base64 utility methods][WHATWG]



  [1]: https://developer.mozilla.org/zh-CN/docs/Web/API/Window.atob
  [2]: https://developer.mozilla.org/zh-CN/docs/Web/API/Window.btoa
  [3]: http://caniuse.com/atob-btoa
  [WHATWG]: https://html.spec.whatwg.org/multipage/webappapis.html#atob 