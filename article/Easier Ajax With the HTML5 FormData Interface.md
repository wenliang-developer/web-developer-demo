# [Easier Ajax With the HTML5 FormData Interface][1] (译文)

如果你正在开发一个单页的应用程序或练习渐进增强技术，你会经常需要拦截表单提交，并经其转化为一个 `Ajax` 调用。让我们来看看一个典型的例子：
```javascript
<form id="myform" action="webservice.php" method="post">
 
<input type="email" name="email" />
 
<select name="job">
    <option value="">role</option>
    <option>web developer</option>
    <option>IT professional</option>
    <option>other</option>
</select>
 
<input type="checkbox" name="freelancer" /> are you a freelancer?
 
<input type="radio" name="experience" value="4" /> less than 5 year's experience
<input type="radio" name="experience" value="5" /> 5 or more year's experience
 
<textarea name="comments" rows="3" cols="60"></textarea>
 
<button type="submit">Submit</button>
 
</form>
```
直接使用 `jQuery` 的表单拦截，因为你可以通过表单节点的 `serialize` 方法提取所有字段的数据，如：
```javascript
$("myform").on("submit", function(e) {
    e.preventDefault();
    $.post(this.action, $(this).serialize());
});
```
如果你使用原生的 `JavaScript`，你需要自己实现类型的功能。你可以手动一个接一个获取各个字段或实现一个通用的表单元素数据提取的循环：
```javascript
document.getElementById("myform").onsubmit = function(e) {
 
    e.preventDefault();
     
    var f = e.target,
        formData = '',
        xhr = new XMLHttpRequest();
     
    // fetch form values
    for (var i = 0, d, v; i < f.elements.length; i++) {
        d = f.elements[i];
        if (d.name && d.value) {
            v = (d.type == "checkbox" || d.type == "radio" ? (d.checked ? d.value : '') : d.value);
            if (v) formData += d.name + "=" + escape(v) + "&";
        }
    }
     
    xhr.open("POST", f.action);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(formData);
 
}
```
这是代码的合理数量，即使你定义它是一个可重复使用的函数。你可能还需要额外的检查，如果你禁用了字段或使它们只读。

幸运的是，一个名不见经传的 `FormData` 接口已经加入到 `XMLHttpRequest2` 中，它可以为你节省很多工作量。让我们使用它来重新写一个 `JavaScript` 提交处理程序：
```javascript
document.getElementById("myform").onsubmit = function(e) {
 
    e.preventDefault();
     
    var f = e.target,
        formData = new FormData(f),
        xhr = new XMLHttpRequest();
     
    xhr.open("POST", f.action);
    xhr.send(formData);
}
```
这是多么的简单 —— 它也更快，比使用 `jQuery` 更容易阅读。

该 `FormData` 构造可以传递一个 `form element node`；这样命令它检索和编码所有字段的 `name/value` 对。你还会注意到，我们没有必要明确设置 `xhr.setRequestHeader("Content-Type")`，因为 `form submit()` 方法是以 `form` 定义的数据格式发送的。`multipart/form-data` 的编码也采用这种方式，你就可以上传文件了。

如果没有 `form element node` 传递给构造器，一个空 `FormData` 对象被创建。而且你可以用 `append` 方法添加额外的 `name/value` 对，来初始化它，例如：
```javascript
var formData = new FormData();
formData.append("name", "value");
formData.append("a", 1);
formData.append("b", 2);
```
如果 `value` 是一个 `File` 或 `Blob`，可选的第三个参数可以指定文件名。

所有现代浏览器都支持 `FormData`。只有 `IE9` 一下会引起麻烦，但是，如果你支持旧版本的 `IE` 浏览器，你可能会使用 `jQuery` 或其他库，来实现自己的字段数据的提取方法。

欲了解更多信息，请参阅 [FormData reference][2] 和 MDN 的 [Using FormData Objects][3]。
 
  [1]: http://www.sitepoint.com/easier-ajax-html5-formdata-interface/
  [2]: https://developer.mozilla.org/en-US/docs/Web/API/FormData
  [3]: https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects
  
 