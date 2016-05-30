#[save/export an SVG](http://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an)

There are 5 steps. I often use this method to output inline svg.

1. get inline svg element to output.
2. get svg source by XMLSerializer.
3. add name spaces of svg and xlink.
4. construct url data scheme of svg by encodeURIComponent method.
5. set this url to href attribute of some "a" element, and right click this link to download svg file.

```javascript
//get svg element.
var svg = document.getElementById("svg");

//get svg source.
var serializer = new XMLSerializer();
var source = serializer.serializeToString(svg);

//add name spaces.
if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
}
if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
}

//add xml declaration
source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

//convert svg source to URI data scheme.
var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

//set url value to a element's href attribute.
document.getElementById("link").href = url;
//you can download svg file by right click menu.
```