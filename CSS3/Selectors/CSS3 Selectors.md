# CSS3 Selectors

<table class="wikitable"> 
   <tbody>
    <tr> 
     <th>Pattern</th> 
     <th>Matches</th> 
     <th>First Defined in CSS Level</th> 
    </tr> 
    <tr> 
     <td>E</td> 
     <td>An element of type E</td> 
     <td>1</td> 
    </tr> 
    <tr> 
     <td>E:link</td> 
     <td>an E element being the source anchor of a hyperlink of which the target is not yet visited (:link) or already visited</td> 
     <td>1</td> 
    </tr> 
    <tr> 
     <td>E:active</td> 
     <td>an E element during certain user actions</td> 
     <td>1</td> 
    </tr> 
    <tr> 
     <td>E::first-line</td> 
     <td>the first formatted line of an E element</td> 
     <td>1</td> 
    </tr> 
    <tr> 
     <td>E::first-letter</td> 
     <td>the first formatted letter of an E element</td> 
     <td>1</td> 
    </tr> 
    <tr> 
     <td>E.warning</td> 
     <td>an E element whose class is &quot;warning&quot; (the document language specifies how class is determined).</td> 
     <td>1</td> 
    </tr> 
    <tr> 
     <td>E#myid</td> 
     <td>an E element with ID equal to &quot;myid&quot;.</td> 
     <td>1</td> 
    </tr> 
    <tr> 
     <td>E F</td> 
     <td>an F element descendant of an E element</td> 
     <td>1</td> 
    </tr> 
    <tr> 
     <td>*</td> 
     <td>Any element</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E[foo]</td> 
     <td>an E element with a &quot;foo&quot; attribute</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E[foo=&quot;bar&quot;]</td> 
     <td>an E element whose &quot;foo&quot; attribute value is exactly equal to &quot;bar&quot;</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E[foo~=&quot;bar&quot;]</td> 
     <td>an E element whose &quot;foo&quot; attribute value is a list of whitespace-separated values, one of which is exactly equal to &quot;bar&quot;</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E[foo|=&quot;en&quot;]</td> 
     <td>an E element whose &quot;foo&quot; attribute has a hyphen-separated list of values beginning (from the left) with &quot;en&quot;</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E:first-child</td> 
     <td>an E element, first child of its parent</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E:lang(fr)</td> 
     <td>an element of type E in language &quot;fr&quot; (the document language specifies how language is determined)</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E::before</td> 
     <td>generated content before an E element's content</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E::after</td> 
     <td>generated content after an E element's content</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E &gt; F</td> 
     <td>an F element child of an E element</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E + F</td> 
     <td>an F element immediately preceded by an E element</td> 
     <td>2</td> 
    </tr> 
    <tr> 
     <td>E[foo^=&quot;bar&quot;]</td> 
     <td>an E element whose &quot;foo&quot; attribute value begins exactly with the string &quot;bar&quot;</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E[foo$=&quot;bar&quot;]</td> 
     <td>an E element whose &quot;foo&quot; attribute value ends exactly with the string &quot;bar&quot;</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E[foo*=&quot;bar&quot;]</td> 
     <td>an E element whose &quot;foo&quot; attribute value contains the substring &quot;bar&quot;</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:root</td> 
     <td>an E element, root of the document</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:nth-child(n)</td> 
     <td>an E element, the n-th child of its parent</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:nth-last-child(n)</td> 
     <td>an E element, the n-th child of its parent, counting from the last one</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:nth-of-type(n)</td> 
     <td>an E element, the n-th sibling of its type</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:nth-last-of-type(n)</td> 
     <td>an E element, the n-th sibling of its type, counting from the last one</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:last-child</td> 
     <td>an E element, last child of its parent</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:first-of-type</td> 
     <td>an E element, first sibling of its type</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:last-of-type</td> 
     <td>an E element, last sibling of its type</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:only-child</td> 
     <td>an E element, only child of its parent</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:only-of-type</td> 
     <td>an E element, only sibling of its type</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:empty</td> 
     <td>an E element that has no children (including text nodes)</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:target</td> 
     <td>an E element being the target of the referring URI</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:enabled</td> 
     <td>a user interface element E which is enabled</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:disabled</td> 
     <td>a user interface element E which is disabled</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:checked</td> 
     <td>a user interface element E which is checked (for instance a radio-button or checkbox)</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E:not(s)</td> 
     <td>an E element that does not match simple selector s</td> 
     <td>3</td> 
    </tr> 
    <tr> 
     <td>E ~ F</td> 
     <td>an F element preceded by an E element</td> 
     <td>3</td> 
    </tr> 
   </tbody>
  </table>

## 扩展阅读

 - [规范：W3C -- Selectors Level 3][1] [w3c.org]
 - [CSS3 Selectors Test][2] [css3.info]
 - [WebPlatform Docs][3] [docs.webplatform.org] 
 - [浏览器支持详情][4]  [quirksmode.org] 

  
[1]: http://www.w3.org/TR/css3-selectors/
[2]: http://tools.css3.info/selectors-test/test.html
[3]: https://docs.webplatform.org/wiki/css/selectors
[4]: http://www.quirksmode.org/css/selectors/
  
 