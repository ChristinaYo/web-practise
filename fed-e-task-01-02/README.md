## let var const
var只有全局作用域和函数作用域的概念，let与之不同的是增加了块级作用域的概念，感觉也算是为了针对之前bug的优化，同时let不具有变量提升，申明必须在调用之前。const和let的作用域是一致的，不过const变量一旦被赋值就不可被再次赋值了，而且声明的变量必须经过初始化。

## symbol类型用途
symbol类型表示一个独一无二的值。创建的每个值都是唯一的。可以用来避免对象属性名重复。也可以用来实现私有成员。

## 浅拷贝和深拷贝
浅拷贝是对值的复制，如果是对象，就是对对象地址的复制，并没有开辟新的栈，也就是复制的结果是两个对象指向同一个地址，修改其中一个对象的属性，则另一个对象的属性也会改变；而深拷贝则是开辟新的栈，两个对象对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性。

## javascript 和typescript区别
typescript是javascript的超集。
typescript是强类型，typescript是弱类型语言。
javascript是动态类型语言，运行阶段才能明确变量类型，typescript是静态类型语言，申明时就确定变量类型。

## typescript 优缺点
优点：
typescript对es兼容性更好。
非常适合长周期开发的大项目，利于维护。
缺点：
多了很多学习成本，新增了很多概念。
对周期短对项目显得有些重。

## 引用计数工作原理和优缺点
通过引用计数器判断当前对象引用值，当一个对象引用关系发生改变，引用计数会发生改变。当值变为0时，GC就开始工作。
优点：
发现垃圾能够立即回收，因为引用计数一旦值变为0就会开始垃圾回收处理。
最大限度减少程序暂停，内存占满当时候，引用计数算法会立马找到数值为0的引用空间来释放。
缺点：
对于循环引用当对象就无法做到回收，因为计数不会为0。
处理时间开销比较大，因为要维护所有对象到引用计数，处理时间会久。

## 标记整理工作流程
标记整理算法会遍历所有对象并将所有可达对象进行标记。
标记整理会将活动对象进行整理移动，然后再去清理和释放内存空间，这样就不会碎片化回收内存空间。

## V8新生代存储区垃圾回收流程
v8内存空间会分为两部分，小空间用于存放新生代对象（存活时间比较短的对象）。
回收过程：先将小空间部分分为两个等大的空间，使用着的空间为from，空闲的是to,活动对象存在from 里。当from空间存储到一定程度，
会触发标记整理操作，对活动对象进行整理，这样再将活动对象直接移动到to空间，最后再进行个交换就完成来垃圾回收。

## 增量标记算法何时使用以及工作原理
v8老生代存储区回收，由于全停顿会造成了浏览器一段时间无响应，所以通过增量标记的方式，将完整的标记拆分成很多部分，每做完一部分就停下来，让JS的应用逻辑执行一会，这样垃圾回收与应用逻辑交替完成。
  