HTTP缓存的2个要点就是：
1. 浏览器检查缓存是否过期（强缓存） 
2. 若缓存过期，与服务器协商是否更新缓存（协商缓存）。

而这2点每个都包含相关的2个报文请求首部：
- 强缓存：过期时间Expires 和有效期Cache-Control: max-age
- 协商缓存：日期再验证If-Modified-Since（对应响应首部：Last-Modifed）和实体标签再验证If-Not-Matched（对应响应首部：Etag = Entity Tag）

# 参考资料
- HTTP权威指南》 > 第7章 > 缓存
