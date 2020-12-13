## 本脚手架demo使用方式
## Getting Started

```shell
# 执行命令，根据问答自动生成
$ demo-cli
```

## 实现思路

### 通过inquirer问答插件来个性化获取用户需要的初始化项，包含名称，版本等等，本次demo写的简易，可以在实际业务场景里丰富

### 主要就是我们把一个已有的模板项目结构文件根据用户传入的配置给重新生成一个新的目录结构

#### 首先需要获取目标模板项目路径，借助于fs模块，我们进行遍历，获取到第一层级的文件/目录，
#### 判断当前是否是文件，如果是，则通过ejs到目标项目目录（pwd）下新建该文件，当然借助于ejs来把用户传入的参数进行渲染
#### 如果不是文件而是目录，则fs.mkdir到目标项目目录（pwd）下创建一个新目录，并且我们需要递归处理当前目录下第二层的文件读取和重写，以此类推即可。