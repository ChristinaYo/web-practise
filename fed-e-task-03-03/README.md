## Vue.js 源码剖析: 响应式原理、虚拟 DOM、模板编译和组件化

------


**Vue 首次渲染的过程**

1. main.js 的 import Vue from 'vue'。
定义 Vue 构造函数，初始化实例成员 / 方法和静态成员 / 方法。

2. main.js 的 new Vue({render: h => h(App)}).$mount('#app')。

- this._init()，初始化 vm 实例
  - 初始化 vm 的生命周期相关变量、事件监听、编译 render 和插槽。
  - beforeCreate 生命钩子的回调
  - inject 注入
  - 初始化 vm 的 _props/methods/_data/computed/watch
  - 初始化 provide
  - created 生命钩子的回调
- vm.$mount 挂载 
  - 如果 没有传递 render，compileToFunction 将 template 转换成 render 函数，调用 mountComponent 渲染 DOM。
  - mountComponent(this, el) 
    - beforeMount 生命钩子的回调
    - 定义 updateComponent
      - vm._update(vm._render())
      - vm._render() 渲染虚拟 DOM 
        - vnode = render.call(vm._renderProxy, vm.$createElement)
        - render() 是实例化传入的 render 或 template 编译生成的 render
      - vm._update() 将虚拟 DOM 转换成真实 DOM
        - vm.$el = vm.__patch__(vm.$el, vnode)
    - 创建 Watcher 实例（渲染 watcher），传入 updateComponent
      - Watcher 实例化会调用一次 get
      - get 方法内部会调用 updateComponent，渲染虚拟 DOM，并将其转换成真实 DOM 挂载
    - mounted 生命钩子的回调
    - 返回 vm

**Vue 响应式原理**

- initState() -> initData() -> observe(data)
- observe(value) 
  - 原始值 或 vnode，直接返回
  - 有__ob__(Observer 实例) 的对象，返回 value.__ob__
  - 创建一个 Observer 实例，返回
- Observer 
  - 给 value 定义不可枚举的__ob__属性
  - 数组的响应式处理，重写 push/pop/splice 等方法
  - 对象的响应式处理，walk 遍历每个属性，defineReactive 设为响应式数据
- defineReactive(obj, key) 
  - 为每个属性创建 dep 对象
  - 如果当前属性值是对象，调用 observe
  - 定义 getter
    - 收集依赖
    - 返回属性值
  - 定义 setter
    - 保存最新值，如果是对象，调用 observe
    - 调用 dep.notify() 派发更新
- 依赖收集
  - 在 watcher 的 get 方法中调用 pushTarget 记录 Dep.target 属性
  - 访问 data 中的成员，触发 defineReactive 给成员定义的 getter，收集依赖 dep.depend()
  - dep.depend() 把属性对应的 watcher 添加到 dep 的 subs 数组中
  - 如果子观察目标 childOb 存在，建立子对象的响应式依赖关系
- Watcher
  - dep.notify() 实际调用的式 watcher 对象的 update 方法
  - queueWatcher() 判断 watcher 是否被处理，如果没有添加到 queue 中，调用 flushScheduleQueue()
  - flushScheduleQueue()
    - 触发 beforeUpdate
    - 调用 watcher.run() run() -> get() -> getter() -> updateComponent
    - 清空上一次的依赖
    - 触发 actived
    - 触发 updated

**虚拟 DOM 中 Key 的作用和好处**

主要作用在 Vue 的虚拟 DOM， diff 算法对比新旧 vnode 时辨识 VNode，高效更新虚拟 DOM。

具体原理：patch 函数中，调用 patchVnode 之前，会首先调用 sameVnode() 判断当前的新老 VNode 是否是相同节点，sameVnode() 中会首先判断 key 是否相同。

>相同父元素的子元素必须有独特的 key，key 重复会造成渲染错误。
>v-for 中不要使用 index 为 key，可能会引起 bug。

**Vue 中模板编译的过程**

- compileToFunctions(template, this, {})
  - 先从缓存中加载编译好的 render 函数
  - 缓存中没有, 调用 compile(template, options)
- compile()
  - 合并 options
  - baseCompile(template.trim(), finalOptions)
- baseCompile()
  - parse() 把 template 解析为 AST
  - optimize() 
    - 标记静态子树，每次重新渲染时不需要重新生成节点
    - patch 阶段跳过静态子树
  - generate() 根据 AST 生成 js 代码字符串
- compileToFunctions() 
  - createFunction()， 把上一步生成的字符串形式的 sj 代码转换为函数
  - render 和 staticRenderFns 初始化完毕，挂载到 Vue 实例的 options 对应的属性中