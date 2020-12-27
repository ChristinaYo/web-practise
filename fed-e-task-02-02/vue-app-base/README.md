
## webpack 打包思路（包含打包项目说明）

#### 1. 首先需要配置入口文件和出口文件路径
#### 2. 对vue文件需要考虑通过vue-loader进行转换成webpack能处理的js对象，兼容性处理需要babel-loader来实现
#### 3. 针对样式文件，less需要通过less-loader，结合css-loader递进转化为js模块，最后要通过style-loader将结果追加到页面
#### 4. 针对png等图片文件，可以借助url-loader来处理，当然要设置一下limit，超过文件大小后可以通过file-loader来处理转化
#### 5. 接下来考虑清理插件clean-webpack-plugin每次打包前将之前打包的文件清理后再开始正式打包过程
#### 6. 这时候不同环境的诉求让我们需要把打包配置分为三个文件拆分，基础配置，生产和开发环境配置，开发环境需要启动一个serve,那么借助webpack-dev-server处理，配置端口，基础路径和是否热替换，如果想要热替换，则借助webpack的HotModuleReplacementPlugin插件实现，样式文件可以默认生效，js文件需要单独配置处理。
#### 7.当然，现在需要去考虑打包生成的文件如何去定位处理问题，那么要结合是否生产环境，对速度，安全的要求，对开发环境综合下来方便定位问题对角度，去处理不同的设置。
#### 8. 开发环境如果涉及发起请求其他服务，考虑浏览器通源策略的跨域问题，可以借助webpack的代理配置来解决该问题。
#### 9. 生产环境需要考虑的是文件的分割和压缩，打包出来的模块虽然需要合并，但是太大也会大大影响性能，所以合理的处理代码的分割也是有必要的。webpack中配置optimization的codespliting来实现。
#### 10. 接下来就是文件的压缩处理，css文件可以先单独通过mini-css-extract-plugin提取处理，然后压缩方式借助optimization的minimizer配置。但是这样配置自动压缩的js会不生效，需要将js压缩也重新通过TerserWebpackPlugin配置。
#### 11. 接下来考虑打包文件持久化缓存问题，可以考虑contenthash来处理转译的文件。




## loader和plugins

#### webpack本身是一个打包工具，它只能识别处理js文件，那么项目中其他文件比如css,png等等其他类型的文件需要通过加载器来转化处理为webpack可以识别的js模块。loader加载器的加载过程类似一个管道，中间可以叠加多个加载器，比如想将less文件转化为目标结果，中间可以通过less-loader,css-loader,style-loader，类似多个管道拼接串联起来。当然最终呈现的结果是js模块。
#### plugins可以解决除了加载资源以外其他自动化的工作。通过plugins可以帮助实现工程化中很多重要的工作。plugins是钩子机制，webpack工作中为每个环节埋下一个钩子。可以将需要实现插件的功能注册在对映的节点上来实现。



## 以下疑问困扰，是否可解：
### 1. 为什么对css处理时我设置MiniCssExtractPlugin.loader不行呢，后面还是只能先换回style-loader才不报错
### 2. devServer，跑dev的时候一堆报错，想不通原因时什么。
### 3. 为什么感觉我的eslint没生效，设置了no-alert规则，在main.js里使用alert测试没用
### 4. 看到说eslint-loader要作废了，但是使用eslint-webpack-plugin出现了报错。