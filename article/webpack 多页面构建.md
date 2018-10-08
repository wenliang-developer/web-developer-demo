### 目标：
* 基于webpack支持react多页面构建（不用gulp，gulp-webpack 构建速度太慢[3]), generator-react-webpack 对单页面支持很好，但对多页面，需要改造
* 提高开发人员的效率
* 并能对项目进行足够的性能优化
* 提高构建的效率

### 配置文件编写（webpack.config.js）
#### 示例：
```js
var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var node_dir = path.join(__dirname, './node_modules/');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 获取所有入口文件
var getEntry = function(globPath) {
    var entries = {
        vendor: ['jquery','react','react-dom','./src/app'] // 类库
    };
    glob.sync(globPath).forEach(function(entry) {
        var pathname = entry.split('/').splice(-2).join('/').split('.')[0];
        entries[pathname] = [entry];
    });
    console.log(entries);
    return entries;
};
// 判断是否是在当前生产环境
var isProduction = process.env.NODE_ENV === 'production';
var entries = getEntry('./src/view/*/*.jsx');
var chunks = Object.keys(entries);
module.exports = {
    entry: entries,
    output: {
        path: path.join(__dirname, './dist'),
        filename: isProduction ?'js/[name].[hash:8].js':'js/[name].js',
        publicPath: '/dist/',
        chunkFilename: 'chunk/[name].chunk.js'
    },
    module: {
        noParse:[
            /*path.join(node_dir,'./react/dist/react.min.js'),
            path.join(node_dir,'./jquery/dist/jquery.min.js'),
            path.join(node_dir,'./react-dom/dist/react-dom.min.js')*/
        ],
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            },
            exclude: node_dir
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css')
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('style', 'css!less')
        }, {
            test: /\.(png|jpe?g|gif)$/,
            loader: 'url?limit=8192&name=img/[hash:8].[ext]'
        }, {
            //文件加载器，处理文件静态资源
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file?limit=10000&name=fonts/[hash:8].[ext]'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json'],
        alias: {
            mod: node_dir
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery', // 使jquery变成全局变量,不用在自己文件require('jquery')了
            jQuery: 'jquery',
            React: 'react',
            ReactDOM: 'react-dom'
        }),
        // 类库统一打包生成一个文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: isProduction ? 'js/vendor.[hash:8].js':'js/vendor.js',
            minChunks: 3 // 提取使用3次以上的模块，打包到vendor里
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin(isProduction ? 'css/[name].[hash:8].css':'css/[name].css')
    ],
    devtool: isProduction ? null : 'source-map'
};
// 生成HTML文件
chunks.forEach(function(pathname) {
    if (pathname == 'vendor') {
        return;
    }
    var conf = {
        title: 'My App',
        filename: isProduction? '../view/' + pathname + '.html' : pathname + '.html',
        template: './src/template.html',
        inject: 'body',
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    };
    if (pathname in module.exports.entry) {
        conf.chunks = ['vendor', pathname];
        conf.hash = false;
    }
    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
});
```

#### Webpack的配置主要包括以下几大项目：
* **entry**：js入口源文件
  
  * 多入口配置
    
    * 为了使用多入口文件，你可以给entry传入一个对象。对象的key代表入口点名字，value代表入口点。当使用多入口点的时候，需要重载output.filename，否责每个入口点都写入到同输出文件里面了。使用[name]来得到入口点名字。
    * 例子：
      ```js
       {
       	entry: {
       		a: "./a",
       		b: "./b",
       		//支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出
       		//该方法可以添加多个彼此不互相依赖的文件
       		c: ["./c", "./d"]
       	},
       	output: {
       		path: path.join(__dirname, "dist"),
       		filename: "[name].entry.js" // a.enrty.js, b.enrty.js, c.entry.js
       	}
       }
      ```
* **output**：生成文件
  
  * output参数是个对象，定义了输出文件的位置及名字.
  * 例子：
    ```js
     output: {
     	path: "dist/js/page",
     	publicPath: "/output/",
     	filename: "[name].bundle.js"
     }
     
     path: 打包文件存放的绝对路径 
     publicPath: 网站运行时的访问路径 
     filename:打包后的文件名
    ```
* **module**：模块加载器
  
  * 在webpack中JavaScript，CSS，LESS，TypeScript，JSX，CoffeeScript，图片等静态文件都是模块，不同模块的加载是通过模块加载器（webpack-loader）来统一管理的。loaders之间以串联的，一个加载器的输出可以作为下一个加载器的输入，最终返回到JavaScript上。
  * 例子：
    ```js
     module: {
     	//加载器配置
     	loaders: [
     		//.css 文件使用 style-loader 和 css-loader 来处理
     		{ 
     			test: /\.css$/, 
     			loader: 'style-loader!css-loader' 
     		},
     		//.js 文件使用 jsx-loader 来编译处理
     		{ 
     			test: /\.js$/, 
     			loader: 'jsx-loader?harmony' 
     		},
     		//.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
     		{ 
     			test: /\.scss$/, 
     			loader: 'style!css!sass?sourceMap'
     		},
     		//图片文件使用 url-loader 来处理，小于8kb的直接转为base64
     		{ 
     			test: /\.(png|jpg)$/, 
     			loader: 'url-loader?limit=8192'
     		}
     	]
     }	
    ```
  * 多个loader可以用在同一个文件上并且被链式调用。链式调用时从右到左执行且loader之间用“!”来分割。
  * 模块加载器（loader）自身可以根据传入不同的参数进行配置。
* **resolve**：文件路径的指向
  
  * webpack在构建包的时候会按目录的进行文件的查找，resolve属性中的extensions数组中用于配置程序可以自行补全哪些文件后缀：
  * 例子：
    ```js
     resolve: {
     	//查找module的话从这里开始查找
     	root: '/pomy/github/flux-example/src', //绝对路径
     	//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
     	extensions: ['', '.js', '.json', '.scss'],
     	//模块别名定义，方便后续直接引用别名，无须多写长长的地址
     	alias: {
     		AppStore : 'js/stores/AppStores.js',//后续直接 require('AppStore') 即可
     		ActionType : 'js/actions/ActionType.js',
     		AppAction : 'js/actions/AppAction.js'
     	}
     }
    ```
* **plugins**：插件，比loader更强大，能使用更多webpack的api
  
  * 插件一般都是用于输出bundle的node模块。例如，uglifyJSPlugin获取bundle.js然后压缩和混淆内容以减小文件体积。类似的extract-text-webpack-plugin内部使用css-loader和stylloader来收集所有的css到一个地方最终将结果提取结果到一个独立的”styles.css“文件，并且在html里边引用style.css文件。
  * 例子：
    ```js
     var ExtractTextPlugin = require("extract-text-webpack-plugin");
     
     module: {
     	loaders: [
     		{
     			test: /\.css$/,
     			loader: ExtractTextPlugin.extract("style-loader", "css-loader")
     		},
     		{
     			test: /\.less$/,
     			loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
     		}
     	]
     },
     plugins: [
     	new ExtractTextPlugin("[name].css")
     ]
    ```
  * code-splitting 插件CommonsChunkPlugin
    
    * 将多次引用的模块单独打包
      ```js
       new webpack.optimize.CommonsChunkPlugin({
       	name: 'vendor',
       	filename: isProduction ? 'js/vendor.[hash:8].js':'js/vendor.js',
       	minChunks: 3 // 提取使用3次以上的模块，打包到vendor里
       })
      ```
  * 多页面 html 生成插件 html-webpack-plugin
    
    * 例子：
      ```js
       var HtmlWebpackPlugin = require('html-webpack-plugin');
       
       chunks.forEach(function(pathname) {
       if (pathname == 'vendor') {
           return;
       }
       var conf = {
           title: 'My App',
           filename: isProduction? '../view/' + pathname + '.html' : pathname + '.html',
           template: './src/template.html',
           inject: 'body',
           minify: {
               removeComments: true,
               collapseWhitespace: false
           }
       };
       if (pathname in module.exports.entry) {
           conf.chunks = ['vendor', pathname];
           conf.hash = false;
       }
       module.exports.plugins.push(new HtmlWebpackPlugin(conf));
      });
      ```
    * src目录下有个template.html文件，无需引入任何css和js，webpack会自动帮我们打包引入，`<%= htmlWebpackPlugin.options.title %>`读取配置好的页面标题
      ```js
       <!DOCTYPE html>
       <html lang="en">
       <head>
       	<meta charset="UTF-8" />
       	<title> <%= htmlWebpackPlugin.options.title %> </title>
       </head>
       <body>
           <div id="app"></div>
       </body>
       </html>
      ```
    * 最终通过打包，会生成对应入口的html文件，
      比如src/view/index/index.js会生成view/index/index.html
      ```js
       <!DOCTYPE html>
       <html lang="en">
       <head>
       	<meta charset="UTF-8">
       	<title> My App </title>
       	<link href="/dist/css/vendor.abf9657f.css" rel="stylesheet">
       	<link href="/dist/css/index/index.abf9657f.css" rel="stylesheet">
       </head>
       <body>
           <div id="app"></div>
       	<script type="text/javascript" src="/dist/js/vendor.abf9657f.js"></script>
       	<script type="text/javascript" src="/dist/js/index/index.abf9657f.js"></script>
       </body>
       </html>
      ```
    * 你会发现相关资源文件都自动引入了，十分便捷。

### webpack 常用命令
* webpack 最基本的启动webpack命令
* webpack -w 提供watch方法，实时进行打包更新
* webpack -p 对打包后的文件进行压缩
* webpack -d 提供SourceMaps，方便调试
* webpack --colors 输出结果带彩色，比如：会用红色显示耗时较长的步骤
* webpack --profile 输出性能数据，可以看到每一步的耗时
* webpack --display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块

### webpack dev server
* 配置示例：
  ```js
   var webpack = require('webpack');
   var WebpackDevServer = require('webpack-dev-server');
   var config = require('./webpack.config.js');
   
   for (var i in config.entry) {
   	// 每个入口文件加入 client websocket 热加载脚本
   	config.entry[i].unshift(
   		"webpack-dev-server/client?http://127.0.0.1:3000/", 
   		"webpack/hot/only-dev-server"
   	);
   }
   config.module.loaders.unshift({
   	test: /\.jsx?$/,
   	loader: 'react-hot',
   	exclude: /node_modules/
   });
   config.plugins.push(new webpack.HotModuleReplacementPlugin());
   new WebpackDevServer(webpack(config), {
   	publicPath: config.output.publicPath,
   	hot: true,
   	historyApiFallback: true,
   	stats: { colors: true }
   	}).listen(3000, '127.0.0.1', function (err, result) {
   	if (err) {
   	    console.log(err);
   	}
   	console.log('server start');
   });
  ```
* 用处
  
  * 开启服务器调试环境
  * 解决以下两个问题：
    
    * webpack --watch 打包速度慢
    * 不能做到hot replace
* 配置
  
  * **Content Base**
    
    * 如果不进行设定的话，服务器伺服默认是在当前目录下。
    * 命令行设置 `webpack-dev-server --content-base build/`
    * webpack 配置
      ```js
       devServer: {
       	contentBase: './src/',
       	historyApiFallback: true,
       	hot: true,
       	port: defaultSettings.port,
       	publicPath: '/assets/',
       	noInfo: false
       }
      ```
  * **publicPath**
    
    * webpack server 伺服的 bundle 是在内存中的，其相对路径由 publicPath 字段指定。
    * 如果用以上的配置，bundle 可以通过地址 localhost:8080/assets/bundle.js 访问到。（注意：访问的不是output目录下的文件而是内存中的数据！）
* 自动更新和热替换
  
  * 配置：
    ```js
     var config = require("./webpack.config.js");
     config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
     var compiler = webpack(config);
     var server = new webpackDevServer(compiler, {
     	hot: true
     	...
     });
     server.listen(8080);
    ```
    
    
    关键配置： `config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");`
    在每个入口文件注入 client websocket 热加载脚本。

### 参考文档：
**webpack 多页面构建**

1. [使用 React 写个简单的活动页面运营系统](http://www.alloyteam.com/2016/03/using-react-to-write-a-simple-activity-pages-design-of-operating-system-article/)
2. [Webpack+React多页面应用探索](http://to-u.xyz/2016/05/26/webpack-react-multiplePage/)
3. [webpack不适合多页面应用？你写的插件还不够多](http://www.jianshu.com/p/f6a2a47d084d)
4. [【AlloyTeam优化系列】构建篇](http://www.alloyteam.com/2015/10/optimization-of-alloyteam-series-building-articles/)

**webpack react generator**
5. [generator-react-webpack](https://github.com/stylesuxx/generator-react-webpack)

**webpack 构建优化**
6. [开发工具心得：如何 10 倍提高你的 Webpack 构建效率](https://segmentfault.com/a/1190000005770042)
7. [webpack使用优化（基本篇）](https://github.com/lcxfs1991/blog/issues/2)
8. [webpack使用优化（react篇）](https://github.com/lcxfs1991/blog/issues/7)
9. [webpack 的 dll 功能](https://segmentfault.com/a/1190000005969643)
10. https://zhuanlan.zhihu.com/p/21748318

**webpack-dev-server**
11. [webpack-dev-server使用方法](https://segmentfault.com/a/1190000006670084)
12. [WEBPACK DEV SERVER](https://webpack.github.io/docs/webpack-dev-server.html)

**多入口以及code-splitting**
13. [webpack multiple-entry-points example](https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points)
14. [MULTIPLE ENTRY POINTS](https://webpack.github.io/docs/multiple-entry-points.html)
15. [CODE SPLITTING](https://webpack.github.io/docs/code-splitting.html)

**webpack 配置**
16.[详解前端模块化工具-Webpack](https://github.com/dwqs/blog/issues/21) **不错的文章**
17. [【翻译】Webpack——令人困惑的地方](https://github.com/chemdemo/chemdemo.github.io/issues/13)**好文章**

**webpack CommonsChunkPlugin详细教程**
18.[webpack CommonsChunkPlugin详细教程](https://segmentfault.com/a/1190000006808865)

