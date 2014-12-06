# [Using FormData Objects][3] (译文)

`FormData` 对象允许你编译一组 `key/value` 对，并使用 `XMLHttpRequest` 来发送。主要用于发送表单数据，但可以独立使用，以表单形式传输有序的带 `key` 的数据。所传输的数据，与 `form encoding type` 设定为 `"multipart/form-data"`，并使用 `form` 的 `submit()` 方法发送的数据，是一样的格式。

## Creating a FormData object from scratch
你可以先创建一个空的 `FormData` 对象,然后使用 `append()` 方法向该对象里添加字段,如下:
```javascript
var formData = new FormData();

formData.append("username", "Groucho");
formData.append("accountnum", 123456); // number 123456 is immediately converted to string "123456"

// HTML file input user's choice...
formData.append("userfile", fileInputElement.files[0]);

// JavaScript file-like object...
var content = '<a id="a"><b id="b">hey!</b></a>'; // the body of the new file...
var blob = new Blob([content], { type: "text/xml"});

formData.append("webmasterfile", blob);

var request = new XMLHttpRequest();
request.open("POST", "http://foo.com/submitform.php");
request.send(formData);
```

> *Note: 字段 `"userfile"` 和 `"webmasterfile"` 都包含一个文件。通过 `FormData.append()` 方法赋给字段 `"accountnum"` 的数字会被自动转换为字符((字段的值可以是一个 `Blob` 对象,一个 `File` 对象,或者一个字符串,剩下其他类型的值都会被自动转换成字符串).)*

这个例子生成一个包含字段名为 `"username"`，`"accountnum"`，`"userfile"` 和 `"webmasterfile"` 的 `FormData` 示例，然后使用 `XMLHttpRequest` 的 `send()` 方法发送表单数据。字段 `"webmasterfile"` 是一个 `Blob`，`Blob` 对象代表不可改变的原始数据，是一个 `file-like object`(类似文件的对象)。`Blob` 的数据不一定是 `JavaScript-native format`。`File` 接口基于 `Blob`，继承 `Blob` 的方法并扩充它以支持用户系统上的文件。为了创建一个 `Blob`，你可以调用 `Blob` 的构造函数。

## 使用HTML表单来初始化一个FormData对象
可以用一个已有的 `<form>` 元素来初始化 `FormData` 对象，只需要把这个 `form` 元素作为参数传入 `FormData` 构造函数即可:
```javascript
var formData = new FormData(someFormElement);
```
例如：
```javascript
var formElement = document.getElementById("myFormElement");
var request = new XMLHttpRequest();
request.open("POST", "submitform.php");
request.send(new FormData(formElement));
```
你还可以在已有表单数据的基础上，继续添加新的键值对，如下:
```javascript
var formElement = document.getElementById("myFormElement");
formData = new FormData(formElement);
formData.append("serialnumber", serialNumber++);
request.send(formData);
```
你可以通过这种方式添加一些不想让用户编辑的固定字段，然后再发送。

## Sending files using a FormData object
你也可以使用 `FormData` 发生文件，只需要简单的包含 `<input type="file">` 元素：
```javascript
<form enctype="multipart/form-data" method="post" name="fileinfo">
  <label>Your email address:</label>
  <input type="email" autocomplete="on" autofocus name="userid" placeholder="email" required size="32" maxlength="64" /><br />
  <label>Custom file label:</label>
  <input type="text" name="filelabel" size="12" maxlength="32" /><br />
  <label>File to stash:</label>
  <input type="file" name="file" required />
  <input type="submit" value="Stash the file!" />
</form>
<div id="output"></div>
```
然后，你可以使用如下代码发送：
```javascript
var form = document.forms.namedItem("fileinfo");
form.addEventListener('submit', function(ev) {

  var
    oOutput = document.getElementById("output"),
    oData = new FormData(document.forms.namedItem("fileinfo"));

  oData.append("CustomField", "This is some extra data");

  var oReq = new XMLHttpRequest();
  oReq.open("POST", "stash.php", true);
  oReq.onload = function(oEvent) {
    if (oReq.status == 200) {
      oOutput.innerHTML = "Uploaded!";
    } else {
      oOutput.innerHTML = "Error " + oReq.status + " occurred uploading your file.<br \/>";
    }
  };

  oReq.send(oData);
  ev.preventDefault();
}, false);
```
> *Note: 如果你调用 `open()` 需要传递引用 `Form` 的 `method` 作为参数。*

你还可以不借助 `HTML` 表单,直接向 `FormData` 对象中添加一个 `File` 对象或者一个 `Blob` 对象；
```javascript
data.append("myfile", myBlob, "filename.txt");
```
如果 `FormData` 对象中的某个字段值是一个 `Blob` 对象，则在发送 `http` 请求时，代表该 `Blob` 对象所包含文件的文件名的 `"Content-Disposition"` 请求头的值在不同的浏览器下有所不同，`Firefox` 使用了固定的字符串 `"blob"`，而 `Chrome` 使用了一个随机字符串。

你还可以使用 `jQuery` 来发送 `FormData`，但必须要正确的设置相关选项：
```javascript
var fd = new FormData(document.getElementById("fileinfo"));
fd.append("CustomField", "This is some extra data");
$.ajax({
  url: "stash.php",
  type: "POST",
  data: fd,
  processData: false,  // tell jQuery not to process the data
  contentType: false   // tell jQuery not to set contentType
});
```
## 提交通过 AJAX 形式和上传文件，而无需 FormData 对象
如果你想知道如何在不使用 `FormData` 对象序列化的情况下通过 `AJAX` 提交表单，请仔细阅读[本段落][2]。

## 参考链接
[FormData interface - WhatWG][1]
 
 
  [1]: https://xhr.spec.whatwg.org/#interface-formdata
  [2]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Submitting_forms_and_uploading_files
  [3]: https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects