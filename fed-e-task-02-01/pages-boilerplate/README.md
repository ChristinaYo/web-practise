
## 开始

```shell
# clone repo
$ git clone https://github.com/zce/pages-boilerplate.git my-awesome-pages
$ cd my-awesome-pages
# install dependencies
$ npm install
```

## 用法

```shell
$ npm run  <task> [options]
```

## 实现思路（gulpfile.js有说明）

### 首先考虑的是静态资源的编译

#### 编译样式文件
#### step1: 通过sass将scss文件转换为css文件
#### step2: 将转换后的文件拷贝至目标资源文件目录下
#### 备注：为了能够保持目标资源文件还是和原始文件的结构一致，可以通过base配置基础目录

#### 然后编译js文件
#### step1: 通过babel将es6转义
#### step2: 将转换后的文件拷贝至目标资源文件目录下

#### 处理模板文件
#### step1: 通过swig将模板文件根据传参内容重写，并且做出防止静态资源缓存处理
#### step2: 将转换后的文件拷贝至目标资源文件目录下

> 当然，当这些文件编译后可以执行bs.reload来让浏览器重新加载更新

#### 接下来需要处理 字体文件，图片，和其他文件，主要其实是压缩工作，和拷贝工作。
#### 单独来讲是因为这些文件本身不经常有变动，开发阶段可以不用如此频繁的去压缩处理浪费时间，后续开发阶段处理时不同放到整体编译流程任务里，只要监听变化重新加载即可（这个可以在browserSync配置结合watch处理）

#### 编译之后会出现旧有资源清理问题，那么可以添加一个clean任务来在每次编译开始之前执行

#### 那么接下来就是考虑模板文件里引用资源合并和压缩的处理，借助gulp-useref来根据注释的方式处理。
#### 这里需要注意一点，在新处理完的js,css文件也会和原来旧的放在一个目录，为了结构更清晰，需要把处理之前的编译任务执行完成的文件放到临时temp目录下。

#### 最后就是梳理整个编译流程
#### step1: 清理旧的编译目录
#### step2: 处理图片，字体其他文件，与此同时处理js和css文件并且合并压缩

#### 当然开发环境我们还需要http服务，这个需要browserSync创建一个serve任务，可以加上对静态资源文件的监听和实时刷新。


