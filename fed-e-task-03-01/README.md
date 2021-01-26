### 当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据
```
let vm = new Vue({
  el: '#el'
  data: {
    o: 'object',
    dog: {}
  },
  method: {
    clickHandler () {
      // 该 name 属性是否是响应式的
      this.dog.name = 'Trump'
    }
  }
})
```

此时给 data 增加的并非响应式数据，在 vue 实例化过程中会创建响应式数据，对已经创建的实例，想要响应式处理可以这样赋值
this.data = { name: 'Trump' };
或者用 set 方法给根对象对下一级属性添加响应式属性：this.$set(this.dog, 'name', 'Trump')


### Diff 算法的执行过程
Diff 核心是当数据变化后不直接操作 dom，而是用 js 对象操作 dom，然后对比新老对象对差异，再去更新差异的节点。
这里的 Diff 并不是树的深度递归，而是同层级的水平对比，算法复杂度是 O(n)。
- 同级别比较时，首先对新老节点数组的开始和结尾设置标记索引。
- 接下来会有以下几种比较方式：
  + 旧开始节点（oldStartVnode）和 新开始节点（newStartVnode）进行比较
    * 如果是 sameVnode(key, sel 相同，没有赋值 key 的时候 sel 相同也算一致)，调用 patchVnode 方法对比和更新节点，旧开始和新开始索引后移
    * 如果不是，进入下一种判断
  + 旧结束节点（oldEndVnode）和 新结束节点（newEndVnode）进行比较
    * 如果是 sameVnode，调用 patchVnode 方法对比和更新节点，旧结束和新结束索引前移
    * 如果不是，进入下一种判断
  + 旧开始节点（oldStartVnode）和 新结束节点（newEndVnode）进行比较
    * 如果是 sameVnode，调用 patchVnode 方法对比和更新节点，把 旧开始节点（oldStartVnode）对应的 DOM 元素移动到右边，旧开始索引后移，新结束索引前移
    * 如果不是，进入下一种判断
  + 旧结束节点（oldEndVnode）和 新开始节点（newStartVnode）进行比较
    * 如果是 sameVnode，调用 patchVnode 方法对比和更新节点，把旧结束节点（oldEndVnode）对应的 DOM 元素移动到左边，旧结束索引前移，新开始索引后移
    * 如果不是，进入下一种判断
  + 非以上四种情况，遍历新节点，使用 新开始节点（newStartVnode 的 key 在老节点数组中找相同节点
    * 如果没有找到，说明 newStartNode 是全新的节点，创建新节点对应的 DOM 元素，插入到 DOM 树中
    * 如果找到了，判断新节点和找到的老节点的 sel 选择器是否相同，如果不相同，说明节点被修改了，重新创建对应的 DOM 元素，插入到 DOM 树中；如果相同，把 elmToMove 对应的 DOM 元素，移动到左边
- 老节点个数和新节点个数不一样的时候，当循环结束：
  + 老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)，说明新节点有剩余，将剩余节点批量插入右边
  + 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，说明老节点有剩余，将剩余节点批量删除
补充：key值的设置很有必要，避免渲染错误发生。



