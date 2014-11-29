# File API
[TOC]

不能直接访问用户计算机中的文件，一直都是 `Web` 应用开发中的一大障碍。`File API` 为 `Web` 应用程序提供了用于表示文件的对象，以及通过编程的方式选择它们和访问它们的数据。这包括：

- 一个 `FileList interface`，它代表用户通过用户界面 `<input type="file">` (即 `input` 代表 `File Upload State`) ，从系统底层选定文件的数组。
- 一个 `Blob interface`，表示不可改变的元素二进制数据，并允许通过访问现有 `Blob` 的一个字节范围来产生单独的 `Blob` 对象(通过 `Blob.slice()`)。
- 一个 `File interface`,它包括关于文件的只读信息属性，如它的名称和最后修改的文件的日期（在磁盘上）。
- 一个 `FileReader interface`,它提供一些方法来读取一个 File 和 Blob,以及 event model 来获得这些读取结果.
- 一个 `URL scheme`,使二进制数据,如文件,能够在 Web applications 中被引用。


此外,该规范还定义了在 web applications threaded 中同步读取文件使用的对象。

该 `API` 被设计成在 web platform(网络平台)上与其他 `API` 和 `elements` 配合使用：`XMLHttpRequest`(例如 File 重载的 send() 或 Blob 对象)、`postMessage`、`DataTransfer`(`drag` 和 `drop API` 的一部分定义在 HTML)和 `Web Worker`。此外，应该可以通过编程的方式从 `<input>`(它是 `File Upload state`)中得到一个文件列表。这些行为在相应的所属规范中定义。

## 简介
Web 应用程序应在用户输入的范围内，对输入具有尽可能多的操作能力。包括用户可能希望文件上传到远程服务器或 `rich web application`(富 Web 应用)等操作。该规范定义了文件、文件列表，访问文件引发的错误和以编程的方式读取文件的基本表现形式。此外，该规范还定义了一个接口，它表示"raw data(原始数据)"，它可以在遵循 `user agents` 的情况下，在主线程上异步处理。
> **Note: 什么是 User Agent？**

>*在计算机科学中，用户代理（英语：User Agent）指的是代表用户行为的软件（软件代理程序）所提供的对自己的一个标识符。例如，一个电子邮件阅读器就是一个电子邮件客户端，而在会话发起协议（SIP）中，用户代理的术语指代的是一个通信会话的所有两个终端。*

`File interface` 表示文件数据，通常从底层文件系统获得。`Blob interface`("Binary Large Object" - 这个名字最初被引入到 Google Gear 的 web APIs)表示不可变的原始数据。`File` 或 `Blob` 的应在主线程中异步读取，并且具有一个可选的 `synchronous API` ，与 web applications 的内部线程使用的一个可选的 `synchronous API`  (原文为：with an optional synchronous API used within threaded web applications)。`asynchronous API` 读取文件，防止主线程的阻塞引起用户 `UI` 冻结。该规范定义了基于 `asynchronous API` 的 `event model` 来读取和访问 `File` 或 `Blob` 的数据。`FileReader` 对象通过事件触发和 `event` 属性，来异步读取文件数据。利用事件和事件处理程序，允许通过独立的代码快来监听读取的进度(这对于 `remote drives` 或 `mounted drives`(已安装的驱动器) 非常有用，其中，文件访问的性能根据本地驱动器而异)和读取文件时可能发生的错误。
```javascript
function startRead() {  
  // obtain input element through DOM 
  
  var file = document.getElementById('file').files[0];
  if(file){
    getAsText(file);
  }
}

function getAsText(readFile) {
        
  var reader = new FileReader();
  
  // Read file into memory as UTF-16      
  reader.readAsText(readFile, "UTF-16");
  
  // Handle progress, success, and errors
  reader.onprogress = updateProgress;
  reader.onload = loaded;
  reader.onerror = errorHandler;
}

function updateProgress(evt) {
  if (evt.lengthComputable) {
    // evt.loaded and evt.total are ProgressEvent properties
    var loaded = (evt.loaded / evt.total);
    if (loaded < 1) {
      // Increase the prog bar length
      // style.width = (loaded * 200) + "px";
    }
  }
}

function loaded(evt) {  
  // Obtain the read file data    
  var fileString = evt.target.result;
  // Handle UTF-16 file dump
  if(utils.regexp.isChinese(fileString)) {
    //Chinese Characters + Name validation
  }
  else {
    // run other charset test
  }
  // xhr.send(fileString)     
}

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
    // The file could not be read
  }
}
```
Blob 对象提供了异步访问 byte 序列，可以通过在 Web applications 中使用 FileReader 对象来使用这些 byte；它有一个 size 属性，表示构成该 byte 序列的 bytes 总数，以及 type 属性，这是一个小写的 ASCII 编码的字符串。如果解析 Blob MIME type 的算法不返回 undefined，则 type 就代表 Blob 可被解析的 MIME type。Blob 的 type 属性也可以用来使用 Blob 时生成一个 Content-Type header：URLs。


File 对象的构造器需要传入两个参数，一个Blob 对象，一个表示底层文件系统中的文件名称，它是一个 UTF-16 的字符串。要想访问 File 的 byte 序列需要通过 FileReader 对象。
```javascript
var fileObject = new File(Blob fileBits, [EnsureUTF16] DOMString fileName)。
```
## interface 
### FileList Interface
```
interface FileList {
    getter File? item(unsigned long index);
    readonly attribute unsigned long length;
};
```
*example: 示例的使用涉及在 form 中访问 `<input type="file">` DOM 元素选定的文件。*
```
// uploadData is a form element
// fileChooser is input element of type 'file'
var file = document.forms['uploadData']['fileChooser'].files[0];

// alternative syntax can be
// var file = document.forms['uploadData']['fileChooser'].files.item(0);

if (file) {
	// Perform file ops
}
```

#### Attribute
- `length` 返回 FileList 对象文件的数量，如果没有文件，这个属性返回 0。

#### Methods and Parameters
 - item(index):
返回 FileList 中指定 index 的 File 对象，如果 FileList 在指定的 index 没有 File 对象，则该方法返回 null。
`index` 表示 FileList 对象中 File 对象的位置，其中 0 代表第一个文件。FileList 还支持属性索引，范围是 0 到 小于 1 的数字，如果没有 File 对象，就没有该属性索引。
> **Note:**
    HTMLInputElement interface 有一个只读类型的 FileList 属性，这也正是在上面的代码示例中看到的。 包含只读类型的 FileList 属性的其他接口，还包括 DataTransfer interface。

### Blob Interface
这个接口表示不可改变的原始数据。它提供了一种方法，通过指定一个 byte 范围对原始的 byte 数据进一步分块，以生成一个新的数据对象。它还提供了一个表示数据块大小的 size 属性。File interface 继承这个接口。
```
 [Constructor, Constructor(sequence < (ArrayBuffer or ArrayBufferView or Blob or DOMString) > blobParts, optional BlobPropertyBag options)]
 interface Blob {

   readonly attribute unsigned long long size;
   readonly attribute DOMString type;

   //slice Blob into byte-ranged chunks

   Blob slice(optional[Clamp] long long start,
     optional[Clamp] long long end,
     optional DOMString contentType);
   void close();

 };

 dictionary BlobPropertyBag {
   DOMString type = "";
 };
```
#### Constructors

```
var blobObject = new Blob()
```

Blob 的构造器可传入零个或多个参数。但调用 Blob 构造器是，User Agents 必须执行下列 Blob 的构造步骤:

 1.  如果没有传入参数，返回一个 0 bytes 的 Blob 对象，size 设置为 0，type 设置为空字符串。
 2.  否则，构造器被传入 blobParts 序列。设 *`a`* 为改序列。
 3.  设 *`bytes`* 是一个空的字节序列。
 4.  设 *`length`* 是 *`a`* 的长度。对于  0 ≤ i < *`length`*，重复一下步骤：
     1.  设 *`element`* 是 *`a`* 的第 i 个元素。
     2.  如果 *`element`* 是一个 DOMString，运行下面的子步骤：
         1.  设 *`s`* 是 *`element`* 使用 WebIDL 中的算法转换为 Unicode 字符序列的返回值。
         2.  将 *`s`* 编码为 `UTF-8` 并将返回的字节追加到 *`bytes`*。
     3.  如果 *`element`* 是一个 `ArrayBufferView`，将 ArrayBuffer 转换为 `byteLength` 字节的序列，`byteOffset` 指向 `ArrayBufferView` 的开始，并将这些字节追加到 *`bytes`*。
     4.  如果 *`element`* 是一个 `ArrayBuffer`，将其转化为 `byteLength` 字节的序列，并将这些字节追加到 *`bytes`*。
     5.  如果 *`element`* 是一个 Blob，将它表示的字节追加到 *`bytes`*，`Blob` 数组元素的 `type` 属性会被忽略。
 5.  如果第二个可选参数提供了 `type` 属性，而不是空字符串，运行下面的子步骤：
     1.  设 *`t`* 是代表第二个可选参数的 `type` 属性。如果 *`t`* 包含 U+0020 ~ U+007E 范围外的任何字符，则设置 *`t`* 为空字符串，并从这些子步骤返回。
     2.  将 *`t`* 的每个字符转换为小写(将字符串转化为小写的 ASCII)。
 6.  返回包含字节的 Blob 对象，`size` 设置为字节的长度，并不清楚它的 `type` 设置为来自上述步骤的 *`t`* 值。

##### Constructor Parameters
调用 `Blob` 构造器可以传入下面的参数：

- **一个 blobParts 序列**

    它需要下面任意数量的元素，不限制顺序：
    - ArrayBuffer 元素。
    - ArrayBufferView 元素。
    - Blob 元素。
    - DOMString 元素。
    
- **一个可选的 BlobPropertyBag**

    这个参数需要一个成员属性：
    - `type`，它是一个小写的 ASCII 编码的字符串，用表示媒体类型。

*构造器的使用示例*
```javascript
// Create a new Blob object
var a = new Blob();

// Create a 1024-byte ArrayBuffer
// buffer could also come from reading a File
var buffer = new ArrayBuffer(1024);

// Create ArrayBufferView objects based on buffer
var shorts = new Uint16Array(buffer, 512, 128);
var bytes = new Uint8Array(buffer, shorts.byteOffset + shorts.byteLength);

var b = new Blob(["foobarbazetcetc" + "birdiebirdieboo"], {type: "text/plain;charset=UTF-8"});

var c = new Blob([b, shorts]);

var a = new Blob([b, c, bytes]);

var d = new Blob([buffer, b, c, bytes]);
```
#### Attributes
 - `size`：返回 `Blob` 对象的字节大小。
 - `type`：`ASCII` 编码的小写字符串表示 `Blob` 的媒体类型。

#### Method
- Blob slice(optional [Clamp] long long start,
                 optional [Clamp] long long end,
                 optional DOMString contentType);
    
    返回一个新的 `Blob` 对象，字节为调用该方法的 `Blob` 对象大于等于 `start` 小于 `end` 范围内的字节，`type` 属性是可选的 `Content-Type` 字符串。

下面的示例说明了可以调用 `slice()` 方法的不同类型。 `File interface` 继承自 `Blob` 接口。
```javascript
// obtain input element through DOM

var file = document.getElementById('file').files[0];
if (file) {
	// create an identical copy of file
	// the two calls below are equivalent

	var fileClone = file.slice();
	var fileClone2 = file.slice(0, file.size);

	// slice file into 1/2 chunk starting at middle of file
	// Note the use of negative number

	var fileChunkFromEnd = file.slice(-(Math.round(file.size / 2)));

	// slice file into 1/2 chunk starting at beginning of file

	var fileChunkFromStart = file.slice(0, Math.round(file.size / 2));

	// slice file from beginning till 150 bytes before end

	var fileNoMetadata = file.slice(0, -150, "application/experimental");
}
```

- `close`：调用它回见原来的 `Blob` 对象清空。这是不可逆的操作。一旦调用，`Blob` 将不能被重新使用。

### File Interface
该接口描述了 `FileList` 中的单个文件，并通过 `name` 属性公开文件名称。继承自 `Blob`。
```
[Constructor(Blob fileBits, [EnsureUTF16] DOMString fileName)]
interface File : Blob {

  readonly attribute DOMString name;
  readonly attribute Date lastModifiedDate;

};
```

#### File Constructor
该 `File` 构造函数需要传入一个 `Blob` 类型的参数，和一个 `DOMString` 类型的参数，并返回具有一下属性的新 `File` 对象 *`F`*:

 1. F.size 等于 `Blob` 类型的 `fileBits` 参数的 `size`，它是一个不可变的原始数据。
 2. F.name 设置如下：

    1.  设 `N` 是一个新的字符串，将 `fileName` 参数的每个字符复制到 `N`，并用 ":"(U+003A 冒号)替换 "/"(U+002F 斜线号)。
    2.  设置 F.name 为 `N`。

 3. 如果 `fileBits` 参数有一个 `type`，则 `F.type = fileBits.type`。
 4. User agents 必须首先设置 `F.lastModifiedDate` 为对象的创建时间。

#### Attribute
- `name`：文件的名称，它仅仅是文件的名称，没有路径信息。在获取时，如果用户代理无法提供这些信息，则必须返回空字符串。
- `lastModifiedDate`：文件最后修改的日期。如果 User agents 可以提供这些信息，这必须返回初始化一个文件的最后修改日期的 `Date` 对象。如果最后修改日期不知道，该属性将返回一个表示当前日期的 `Date` 对象。

### FileReader Interface
该接口提供了可以将 File 对象和 Blob  对象读取到内存中，并通过 progress event 和 event handler 的属性来访问 File 和 Blob 数据的方法。它继承 EventTarget(DOM4 中定义)。最好是通过 User agents 的主线程异步读取文件系统的数据。该接口提供了这样的 asynchronous API，并指定为全局对象的属性(Window)。
```
[Constructor]
interface FileReader: EventTarget {

  // async read methods
  void readAsArrayBuffer(Blob blob);
  void readAsText(Blob blob, optional DOMString label);
  void readAsDataURL(Blob blob);

  void abort();

  // states
  const unsigned short EMPTY = 0;
  const unsigned short LOADING = 1;
  const unsigned short DONE = 2;


  readonly attribute unsigned short readyState;

  // File or Blob data
  readonly attribute(DOMString or ArrayBuffer) ? result;

  readonly attribute DOMError ? error;

  // event handler attributes
  attribute EventHandler onloadstart;
  attribute EventHandler onprogress;
  attribute EventHandler onload;
  attribute EventHandler onabort;
  attribute EventHandler onerror;
  attribute EventHandler onloadend;

};
```

#### Event Handler Attributes
以下是 FileReader 的 event handler 属性。

| event handler attribute | event handler event type |
| ----------------------- | ------------------------ |
| onloadstart             | loadstart                |
| onprogress              | progress                 |
| onabort                 | abort                    |
| onerror                 | error                    |
| onload                  | load                     |
| onloadend               | loadend                  |

#### FileReader States
FileReader 对象可以处于 3 种状态之一。在获取 readyState 时，可以获得当前状态。以下是这些状态的描述：

- EMPTY (数值 0)
    该 FileReader 对象已经创建并且没有读取过数据，读方法没有被调用。这是 新 FileReader 对象的默认状态，直到读取方法被调用为止。
- LOADING (数值为 1)
    File 或 Blob 正在被读取。一个读取方法正在进行，并且在读取时没有发生错误。
- DONE (数值 2)
    整个 File 或 Blob 已经被读入内存中、读取时发生文件错误、使用 abort() 终端读取。该 FileReader 对象不再读取 File 或 Blob。如果 readyState 设置为 DONE，则意味着 FileReader 至少调用了一次读取方法。

#### 读取一个 File 或 Blob
##### 并发读取
FileReader interface 提供了三种异步读取方法：readAsArrayBuffer、readAsText 和 readAsDataURL，用来将文件读取到内存中。如果 FileReader 同时调用多个并发读取方法，User agents 必须在任何一个读取方法抛出 InvalidStateError(DOM4 中引入) 错误时使 readyState  = LOADING。

##### result attribute
在获取时，`result` 返回 Blob 数据的 DOMString，或为 ArrayBufferView，或者为 null，取决于 FileReader 调用的读取方法，以及可能发生的任何错误。下面的列表是 `result` 属性，在特定条件下的返回值：

- 如果 readyState = EMPTY (读取方法没有被调用)，那么 `result` 为 null。
- 如果使用 readAsDataURL() 的情况下，`result` 返回的结果是 File 或 Blob 通过 Data URL 编码的数据。
- 如果使用 readAsText() 方法，并且读取 File 或 Blob 时没有发生错误，那么 `result` 为表示 File 或 Blob 数据的文本字符串，通过 DOMString label 指定的格式，将字符串解码到内存中。
- 如果使用 readAsArrayBuffer 读取 File 或 Blob 并且没有错误，那么 `result` 返回一个 ArrayBuffer 对象。

如果读取成功，`result` 属性必须在前一个 progress event 触发后才会返回一个非空值。因为所有的读取方法在获得 Blob 的数据时不同步。任务队列在 Blob 数据可用时更新这个 `result` 属性。

##### Error Steps

 1. 触发名为 error 的 progress event ，设置 `error`。在获取时，`error` 必须是一个 DOMError 表示已发生的文件错误。
 2. 除非 readyState = LOADLING，触发名为 `loadend` 的 progress event。如果 reayState != LOADLING 不会触发 `loadend`。
 3. 终止读方法的任何算法。
    **Note：** 由于算法被终止所以读方法返回。

### FileReaderSync Interface
```
[Constructor]
interface FileReaderSync {

  // Synchronously return strings

  ArrayBuffer readAsArrayBuffer(Blob blob);
  DOMString readAsText(Blob blob, optional DOMString label);
  DOMString readAsDataURL(Blob blob);
};
```
### Blob URL
```
partial interface URL {
  static DOMString ? createObjectURL(Blob blob);
  static DOMString ? createFor() Blob blob);
  static void revokeObjectURL(DOMString url);
};
```
- [File API - W3C WD - 2013.9.12][1]
- [MDN window.btoa][2]
- [Base64 encoding and decoding 浏览器支持性][3]
- [WHATWG - Base64 utility methods][WHATWG]



  [1]: http://www.w3.org/TR/FileAPI/ "File API W3C Last Call Working Draft 12 September 2013"
  [2]: https://developer.mozilla.org/zh-CN/docs/Web/API/Window.btoa
  [3]: http://caniuse.com/atob-btoa
  [WHATWG]: https://html.spec.whatwg.org/multipage/webappapis.html#atob 