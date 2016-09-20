# File API
[TOC]

不能直接访问用户计算机中的文件，一直都是 `Web` 应用开发中的一大障碍。`File API` 为 `Web` 应用程序提供了用于表示文件的对象，以及通过编程的方式选择它们和访问它们的数据。这包括：

- 一个 `FileList interface`，它代表用户通过用户界面 `<input type="file">` (即 `input` 代表 `File Upload State`) ，从系统底层选定文件的数组。
- 一个 `Blob interface`，表示不可改变的原始二进制数据，并允许通过访问现有 `Blob` 的一个字节范围来产生单独的 `Blob` 对象(通过 `Blob.slice()`)。
- 一个 `File interface`,它包括关于文件的只读信息属性，如它的名称和最后修改的文件的日期（在磁盘上）。
- 一个 `FileReader interface`,它提供一些方法来读取一个 File 和 Blob，以及通过 event model 来获得这些读取结果.
- 一个 `URL scheme`,使二进制数据,如文件,能够在 Web applications 中被引用。


此外,该规范还定义了在 web applications threaded 中同步读取文件使用的对象。

该 `API` 被设计成在 web platform(网络平台)上与其他 `API` 和 `elements` 配合使用：`XMLHttpRequest`(例如，使用 File 或 Blob 对象重载 send() )、`postMessage`、`DataTransfer`(`drag` 和 `drop API` 的一部分定义在 HTML)和 `Web Worker`。此外，应该可以通过编程的方式从 `<input>`(它是 `File Upload state`)中得到一个文件列表。这些行为在相应的所属规范中定义。

## 简介
Web 应用程序应在用户输入的范围内，对输入具有尽可能多的操作能力。包括用户可能希望文件上传到远程服务器或 `rich web application`(富 Web 应用)等操作。该规范定义了文件、文件列表，访问文件引发的错误和以编程的方式读取文件的基本表现形式。此外，该规范还定义了一个接口，它表示"raw data(原始数据)"， `user agents` 需要遵循在主线程上异步处理。
> **Note: 什么是 User Agent？**

>*在计算机科学中，用户代理（英语：User Agent）指的是代表用户行为的软件（软件代理程序）所提供的对自己的一个标识符。例如，一个电子邮件阅读器就是一个电子邮件客户端，而在会话发起协议（SIP）中，用户代理的术语指代的是一个通信会话的所有两个终端。*

`File interface` 表示文件数据，通常从底层文件系统获得。`Blob interface`("Binary Large Object" - 这个名字最初被引入到 Google Gear 的 web APIs)表示不可变的原始数据。`File` 或 `Blob` 的应在主线程中异步读取，并且具有一个可选的 `synchronous API` ，与 web applications 的内部线程使用的一个可选的 `synchronous API`  (原文为：with an optional synchronous API used within threaded web applications)。`asynchronous API` 读取文件，防止主线程的阻塞引起用户 `UI` 冻结。该规范定义了基于 `asynchronous API` 的 `event model` 来读取和访问 `File` 或 `Blob` 的数据。`FileReader` 对象通过事件触发和 `event` 属性，来异步读取文件数据。利用事件和事件处理程序，允许通过独立的代码块来监听读取的进度(这对于 `remote drives` 或 `mounted drives`(已安装的驱动器) 非常有用，其中，文件访问的性能根据本地驱动器而异)和读取文件时可能发生的错误。

*下面的示例中，不同的代码块处理 progress、error 和 load。*
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

Blob 的构造器可传入零个或多个参数。但调用 Blob 构造器是，User Agents 必须执行下列 Blob 的构造步骤：


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

该 `File` 构造函数需要传入一个 `Blob` 类型的参数，和一个 `DOMString` 类型的参数，并返回具有一下属性的新 `File` 对象 *`F`*：

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
FileReader interface 提供了三种异步读取方法：readAsArrayBuffer、readAsText 和 readAsDataURL，用来将文件读取到内存中。如果 FileReader 同时调用多个并发读取方法，User agents 必须在任何一个读取方法抛出 InvalidStateError(DOM4 中引入) 错误时使 readyState = LOADING。

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

#####  event 概述
此规范说明了一个正在运行的读取方法如何取得进度通知。FileReader 对象取其每 50ms 或每个字节读入内存中的一个最频繁的时间，将一个 progress 事件加入任务队列中。至少有一个 progress 事件在 load 之前触发，并在读取操作 100% 时完成读取操作。如果 blob 100%读入内存的时间小于 50ms，User agents 必须触发一个 progress 事件。

以下是 FileReader 可能触发的 event。
| Event name |   Interface   | 什么时候触发 |
| ---------- | ------------- | ------------ |
| loadstart  | ProgressEvent | 当开始读取时触发 |
| progress   | ProgressEvent | 当读取(和解码) blob | 
| abort      | ProgressEvent | 当读取被终止。例如，调用 abort() |
| error      | ProgressEvent | 当读取失败 |
| load       | ProgressEvent | 当读取已经成功完成 |
| loadend    | ProgressEvent | 当请求已经完成(成功或失败) |

example：*以下是一个 progress、error 和 load 的例子*
```html
<!DOCTYPE html>
<html>
<head>
    <title>File API Example</title>
    <script src="EventUtil.js"></script>
</head>
<body>
    <p>This page is a demonstration of the File API. This works in the latest versions of all major browsers, but you may need to place this file on a web server to get it to work.</p>
    <p>Select a file below.</p>
    <input type="file" id="files-list">
    <script>
        window.onload = function(){
            
            var filesList = document.getElementById("files-list");
            EventUtil.addHandler(filesList, "change", function(event){
                var info = "",
                    output = document.getElementById("output"),
                    progress = document.getElementById("progress"),
                    files = EventUtil.getTarget(event).files,
                    type = "default",
                    reader = new FileReader();
                    
                if (/image/.test(files[0].type)){
                    reader.readAsDataURL(files[0]);
                    type = "image";
                } else {
                    reader.readAsText(files[0]);
                    type = "text";
                }
                    
                reader.onerror = function(){
                    output.innerHTML = "Could not read file, error code is " + reader.error.code;
                };
                
                reader.onprogress = function(event){
                    if (event.lengthComputable){
                        progress.innerHTML = event.loaded + "/" + event.total;
                    }
                };
                
                reader.onload = function(){
                
                    var html = "";
                    
                    switch(type){
                        case "image":
                            html = "<img src=\"" + reader.result + "\">";
                            break;
                        case "text":
                            html = reader.result;
                            break;
                            
                    }
                    output.innerHTML = html;
                };
            });
        };
        
    </script>
    <div id="progress"></div>
    <pre id="output"></pre>
</body>
</html>
```

###### event 触发条件
以下适用于使用异步读取方法时，event 的触发条件：

 1. 一旦 loadstart 已经触发，相应的 loadend 在读取完成时触发，除非：
     - 读取方法通过 abort() 取消，并且新的读取方法被调用。
     - 在事件处理函数 load 中启动新的读取方法。
     - 在事件处理函数 end 中启动新的读取方法。
     
     > **Note：**loadstart 和 loadend 不再以一对一的方式衔接在一起。

     **Example:**
     这个示例展示了链式读取的方法，即在第一次读取方法的事件处理程序中开始调用另一个读取方法。
```
    // In code of the sort...
    reader.readAsText(file);
    reader.onload = function(){reader.readAsText(alternateFile);}
    
    .....

    //... the loadend event must not fire for the first read

    reader.readAsText(file);
    reader.abort();
    reader.onabort = function(){reader.readAsText(updatedFile);}

    //... the loadend event must not fire for the first read
     
```

 2. Blob已经完全读入内存时，一个 progress 事件 将触发。
 3. 没有 progress 事件在 loadstart 之前触发。
 4. 在任何一个 abort、load、error 触发后没有 progress 事件触发。在一个给定的读取操作中最多有一个 abort、load、error 被触发。
 5. 没有 abort、load、error 事件，在 loadend 之后触发。

### FileReaderSync Interface
该接口提供了一些方法来同步读取 File 和 Blob 对象到内存中。
```
[Constructor]
interface FileReaderSync {

  // Synchronously return strings

  ArrayBuffer readAsArrayBuffer(Blob blob);
  DOMString readAsText(Blob blob, optional DOMString label);
  DOMString readAsDataURL(Blob blob);
};
```
#### readAsText method
当 DOMString readAsText(blob，label) 方法被调用(label 是可选的)，遵循下面的步骤：

 1. 如果读取 blob 参数的过程中发生错误，抛出适当的异常。终止全部步骤。
 2. 如果没有发生错误，读取 blob 到内存中。返回 blob 使用编码的数据内容。

#### readAsDataURL method
DOMString readAsDataURL(Blob blob);

 1. 如果读取 blob 参数的过程中发生错误，抛出适当的异常。终止全部步骤。
 2. 如果读取 blob 到内存中没有发生错误。然会返回代表 blob 内容的 Data URL。
     - 使用 blob 的 type 属性作为 Data URL 的一部分。
     - 如果 type 属性是不可用的，返回的 Data URL 没有媒体类型。没有媒体类型的 Data URL 必须被 User agents 是为纯文本。

#### readAsArrayBuffer method
ArrayBuffer readAsArrayBuffer(Blob blob); 

 1. 如果在读取 blob 参数时发生错误，抛出适当的异常。终止所有步骤。
 2. 如果没有发生错误，读取 blob 到内存中。返回 blob 数据的 ArrayBuffer 形式。




## Errors and Exceptions
从底层文件系统中读取文件时的潜在错误条件：

- File 或 Blob 可无法在当前的异步或同步读取方法调用时被访问。这可能是由于在获取引用时已经被移动或者删除(例如，其他应用程序并发的修改)。参见 NotFoundError。
- File 或 Blob 不可读。这很可能是由于引用的 File 或 Blob 已被获取访问权限的问题(例如，其他应用程序并发锁定)。参见 NotReadableError。
- User agents 可以决定哪些文件在 Web applications 中使用是不安全的。磁盘上被选中的文件发生改变，可能会导致无效的读取。此外，一些文件和目录结构受限于底层文件系统，试图读取它们可被视为违反安全。参见 SecurityError。

## Blob 和 File 的 URL 引用
这里 URL 也被称为 blob URL，指的是引用保持在 File 或 Blob 中的 Data URL。使用 URL 的好处是不必把文件内容都到 JavaScript 中而直接使用文件内容。为此，只要在需要文件内容的地方提供 URL 即可。

### Blob URL
```
partial interface URL {
  static DOMString ? createObjectURL(Blob blob);
  static DOMString ? createFor() Blob blob);
  static void revokeObjectURL(DOMString url);
};
```

要创建 URL，可以使用 window.URL.createObjectURL() 方法，并传入 File 或 Blob 对象。
这个函数返回一个字符串，指向一块内存的地址。因为这个字符串是 URL，所以可以在 DOM 中使用，例如下面的代码可以在页面中显示一个图像文件。
```html
<!DOCTYPE html>
<html>
<head>
    <title>File API Example</title>
    <script src="EventUtil.js"></script>
</head>
<body>
    <p>This page is a demonstration of the File API. This works in the latest versions of all major browsers, but you may need to place this file on a web server to get it to work.</p>
    <p>Select an image file below.</p>
    <input type="file" id="files-list">
    <script>
    
        function createObjectURL(blob){
            if (window.URL){
                return window.URL.createObjectURL(blob);
            } else if (window.webkitURL){
                return window.webkitURL.createObjectURL(blob);
            } else {
                return null;
            }
        }
    
        window.onload = function(){
            
            var filesList = document.getElementById("files-list");
            EventUtil.addHandler(filesList, "change", function(event){
                var info = "",
                    output = document.getElementById("output"),
                    progress = document.getElementById("progress"),
                    files = EventUtil.getTarget(event).files,
                    reader = new FileReader(),
                    url = createObjectURL(files[0]);

                if (url){
                    if (/image/.test(files[0].type)){
                        output.innerHTML = "<img src=\"" + url + "\">";
                    } else {
                        output.innerHTML = "Not an image.";
                    }
                } else {
                    output.innerHTML = "Your browser doesn't support object URLs.";
                }
            });
        };
        
    </script>
    <pre id="output"></pre>
</body>
</html>
```
 `<img>` 标签会找到相应的内存地址，直接读取数据并将图像显示在页面中。 
 如果要释放内存，可以把 URL 传给 window.URL.revokeObjectURL()。虽然页面卸载时会自动释放 URL 占用的内存。不过，为了确保尽可能少的占用内存，最好在不需要么某个 URL 时，就马上手工释放器占用的内存。
 
## example manifest

在这里列出了所有的示例清单：

- *FileAPIExample01.html* —— 公国监听 change 事件并读取 files 集合，获取每个选中文件的信息。
- *FileAPIExample02.html* —— load、error、progress 事件的使用。
- *FileAPIExample03.html* —— 使用 slice() 只读取文件的 32B 内容。
- *FileAPIExample04.html* —— 使用 blob URL 显示选中图片。
- *FileAPIExample05.html* —— 与 `Drag and Drop API` 配合使用，读取拖放到放置目标的文件信息。
- *FileAPIExample06.html* —— 与 FormData 配合，实现 XHR 文件上传。

## 参考资源

- [File API - W3C WD - 2013.9.12][1]
- [File API 浏览器支持性][2]
- JavaScript 高级程序设计(第3版) - 25.4 File API



  [1]: http://www.w3.org/TR/FileAPI/ "File API W3C Last Call Working Draft 12 September 2013"
  [2]: http://caniuse.com/fileapi
