### React 16 版本中初始渲染的流程
- render 阶段负责创建 Fiber 数据结构，并为 Fiber 节点打标记，标记当前 Fiber 节点要进行的 DOM 操作。
    + 将子树渲染到容器中 (初始化 Fiber 数据结构: 创建 fiberRoot 及 rootFiber)
    + 判断是否为服务器端渲染，如果不是，则清空 container 容器中的节点
    + 通过实例化 ReactDOMBlockingRoot 类创建 LegacyRoot，创建 LegacyRoot 的 Fiber 数据结构
    + 创建 container，创建根节点对应的 fiber 对象
    + 获取 container 的第一个子元素的实例对象
    + 计算任务的过期时间，再根据任务过期时间创建 Update 任务，将任务(Update)存放于任务队列(updateQueue)中。判断任务是否为同步 调用同步任务入口。
    + 构建 workInProgress Fiber 树
- commit 阶段负责根据 Fiber 节点标记 ( effectTag ) 进行相应的 DOM 操作。

### 为什么 React 16 版本中 render 阶段放弃了使用递归
React 16 之前的版本比对更新 VirtualDOM 的过程是采用循环加递归实现的，这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中组件数量庞大，主线程被长期占用，直到整棵 VirtualDOM 树比对更新完成之后主线程才能被释放，主线程才能执行其他任务。这就会导致一些用户交互，动画等任务无法立即得到执行，页面就会产生卡顿, 非常的影响用户体验。 React 16 采用循环模拟递归。而且比对的过程是利用浏览器的空闲时间完成的，不会长期占用主线程，这就解决了 virtualDOM 比对造成页面卡顿的问题。

### React 16 版本中 commit 阶段的三个子阶段分别做了什么事情
>三个子阶段：
>####before mutation 阶段：执行 DOM 操作前
关键函数 commitBeforeMutationEffects, commitBeforeMutationLifeCycles。调用类组件的 getSnapshotBeforeUpdate 生命周期函数。

>####bmutation 阶段：执行 DOM 操作
关键函数 commitMutationEffects, commitPlacement, getHostParentFiber, insertOrAppendPlacementNodeIntoContainer, insertInContainerBefore, appendChildToContainer。 根据 effectTag 执行 DOM 操作，挂载 DOM 元素。

>####layout 阶段：执行 DOM 操作后
关键函数 commitLayoutEffects, commitLifeCycles, commitUpdateQueue, commitHookEffectListMount。调用类组件的 componentDidMount，componentDidUpdate 生命周期函数，和函数组件的钩子函数。处理 render 方法的第三个参数。

### workInProgress Fiber 树存在的意义是什么
React 中最多会同时存在两棵 Fiber 树，当前页显示的内容对应的 Fiber 树叫做 current Fiber 树，发生更新时，React 会在内存中重新构建一颗新的 Fiber 树，这颗正在构建的 Fiber 树就叫做 workInProgress Fiber 树。

React 使用双缓存技术完成 Fiber 树的构建与替换，实现DOM对象的快速更新。
在双缓存技术中，workInProgress Fiber 树就是即将要显示在页面中的 Fiber 树，当这颗 Fiber 树构建完成后，React 会使用它直接替换 current Fiber 树达到快速更新 DOM 的目的，因为 workInProgress Fiber 树是在内存中构建的所以构建它的速度是非常快的。一旦 workInProgress Fiber 树在页面上呈现，它就会变成 current Fiber 树。