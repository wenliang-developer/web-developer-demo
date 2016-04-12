# SASS 常见错误

## SSL_connect 错误
系统提示
```
SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (https://bb-m.rubygems.org/gems/multi_json-1.3.2.gem)
```
这是说系统中的ssl设置有问题。

可以参考这篇文章来解决：[《OpenSSL Errors and Rails – Certificate Verify Failed》](http://railsapps.github.io/openssl-certificate-verify-failed.html)。

因为自己使用的win7系统，所以参照了文章中提到的Fnichol提供的[解决办法](https://gist.github.com/fnichol/867550)来解决。
我使用的the manual way (boring)方法，因为尝试第一种自动化的方法时，ruby程序执行出错。

我看了下，可能需要在源程序中将ruby的安装路径改为我自己机器上的安装路径。因为只是猜测，加上我对ruby还一无所知，我就尝试了手工的方法。手工方法也就是：首先，在本地ruby的安装路径下（如D:\Ruby2000)，新建一个名为cacert.pem的文件，然后将网页上提供的cacert.pem中的内容复制到该文件并保存。然后设置一个名为SSL_CERT_FILE的环境变量，值为cacert.pem的路径即可。

