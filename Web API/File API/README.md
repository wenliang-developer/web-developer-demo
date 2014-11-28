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
Web 应用程序应在用户输入的范围内，对输入具有尽可能多的操作能力。包括用户能希望文件上传到远程服务器或 `rich web application`(富 Web 应用)等操作。该规范定义了文件、文件列表，访问文件引发的错误和以编程的方式读取文件的基本表现形式。此外，该规范还定义了一个接口，它表示"raw data(原始数据)"，它可以在遵循 `user agents` 的情况下，在主线程上异步处理。
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

## interface 
### FileList Interface
```
interface FileList {
    getter File? item(unsigned long index);
    readonly attribute unsigned long length;
};
```
### Blob Interface
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
### File Interface
```
[Constructor(Blob fileBits, [EnsureUTF16] DOMString fileName)]
interface File : Blob {

  readonly attribute DOMString name;
  readonly attribute Date lastModifiedDate;

};
```
### FileReader Interface
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