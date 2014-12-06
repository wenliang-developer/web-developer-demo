# Interface FormData

```IDL
typedef (File or USVString) FormDataEntryValue;

[Constructor(optional HTMLFormElement form),
 Exposed=(Window,Worker)]
interface FormData {
  void append(USVString name, Blob value, optional USVString filename);
  void append(USVString name, USVString value);
  void delete(USVString name);
  FormDataEntryValue? get(USVString name);
  sequence<FormDataEntryValue> getAll(USVString name);
  boolean has(USVString name);
  void set(USVString name, Blob value, optional USVString filename);
  void set(USVString name, USVString value);
  iterable<USVString, FormDataEntryValue>;
};
```
**FormData** 对象表示 **entries**(表项) 的一个有序列表，每个 `entry` 有一个 **name** 和一个 **value**。

如果 `entry` 的 type 是 "file"，它的文件名是 entry 的 name 属性的值。

<span id="creat-an-entry">**create an entry**</span>，传入 *name*，*value* 和一个可选的 *filename*，运行一下步骤：

 1. 设 *entry* 是一个新的 `entry`。
 2. 设置 *entry* 的 `name` 为 *name*。
 3. 如果 *value* 是一个 **Blob** 对象并且不是 **File** 对象，设置 *value* 是一个新的 **File** 对象，表示与 **Blob** 对象相同的 `bytes`，它的 **name** 属性值为 "blob"。
 4. 如果 *value* 是一个 **File** 对象并且 *filename* 给出，设置 *value* 是一个新的 **File** 对象，表示与 **File** 对象相同的 `bytes`，它的 **name** 属性值为 *filename*。
 5. 设置 *entry* 的 `value` 为 *value*。
 6. 返回 *entry*。


**FormData(*form*)** 构造函数必须运行这些步骤：

 1. 设 *fd* 是一个新的 `FormData` 对象。
 2. 如果 *form* 给定，设置 *fd* 的 `entries` 的结果是 *form* 的 `constructing the form data set`(构造的表单数据集)。
 3. 返回 *fd*。

**append(*name*, *value*, *filename*)** 方法必须执行这些步骤：

 1. 设 *entry* 是给定 *name*，*value*，*filename*(如果给定)来 [create an entry](#creat-an-entry) 返回的结果。
 2. 追加 *entry* 到 `FormData` 对象的 `entries list` 中。

**delete(*name*)** 方法必须删除所有 `name` 是 *name* 的 `entries`。

**get(*name*)** 方法必须返回 `name` 是 *name* 的第一个 `entry`，否则返回 `null`。

**getAll(*name*)** 方法必须返回 `name` 是 *name* 的所有 `entries` 的 `value` 的有序列表，否则返回空序列。

**set(*name*, *value*)** 方法必须执行这些步骤：

 1. 设 *entry* 是给定 *name*，*value*，*filename*(如果给定)来 [create an entry](#creat-an-entry) 返回的结果。
 2. 如果有 `name` 是 *name* 的 `entries`，替换第一个 `entry` 为 *entry* 并移除其他的 `entry`。
 3. 否则，将 *entry* 追加到 `FormData` 对象的 `entries` 列表中。

**has(*name*)** 方法 `name` 等于 *name* 的 `entry`，返回 `true`，否则返回 `false`。

 
 
## 参考链接
 
 [FormData interface - WhatWG][1]
 
 
  [1]: https://xhr.spec.whatwg.org/#interface-formdata
 