### JSON树的对比，并且用tag体现差异

- 需求：
  - 有一个表单报文，内容多，且层次比较深。如果提交报文的时候某处更新了，需要告诉后端哪里更新了（后端美言之为了性能，遍历两棵树耗性能），并打上tag（tag有类型）。
  每条数据有一个tag状态的标识action。默认action = 3（未改变）。
    - 数据删除（delete）：action = 0
    - 数据新增（create）：action = 1
    - 数据修改（update）：action = 2
    - 数据不变（unchanged）：action = 3

- 难点：
  * 数据可能是新增、修改、或者删除，删除的数据也需要发送给后台，前端需要对删除数据进行save。
  * 子层数据发生变化了，父层的action也要相应的变成修改状态的action。

- 启发：
  * 因为最近在研究Virtual DOM的diff，也深受启发。从DOM对象树映射到JavaScript对象，通过给旧DOM树添加一个唯一标记，然后diff虚拟树，再通过唯一标记把patch的信息追加到旧DOM树。其中，JSON树的对比与diff虚拟树是差不多的过程，只不过patch的部分，JSON树是直接把差异追加到新JSON树，而不是DOM

- 解决方案
 * 方案一：最简单的解决方案就是，在每个输入框加一个监听事件，数据发生改变，在此数据上加一个action。
 * 方案二：也是我原来使用的方案，新增和修改直接改变原来JSON树；删除特殊处理，将JSON树中数据删除，并且将删除的数据存储到全局store中。数据提交的时候，用递归，将所有数据的状态改为修改（update），将这条store中删除数据patch到原删除位置，并且action改为删除（delete）。
 * 方案三：也是本文的核心，给JSON树每层数据加上tag，将旧JSON树存储到全局store中。修改数据，提交，将旧JSON树同新JSON树进行对比，修改的部分追加到新JSON树。

- 简单例子


修改前
```js
let old = {
  action: 3,
  val: 1,
  children: [
    {
      action: 3,
      val: 1
    },
    {
      action: 3,
      val: 2
    }
  ]
}
```

加上标记 \_\_i\_\_
```js
let old = {
  action: 3,
  val: 1,
  __i__: 1
  children: [
    {
      action: 3,
      val: 1,
      __i__: 1
    },
    {
      action: 3,
      val: 2,
      __i__: 2 // 注意数组的tag是递增的
    }
  ]
}
```

修改后
```js
let old = {
  action: 3,
  val: 1,
  __i__: 1
  children: [
    {
      __i__: 1
      action: 3,
      val: 4
    },
    {
      val: 5
    }
  ]
}
```

最终提交的报文
```js
let old = {
  action: 2,
  val: 1,
  __i__: 1
  children: [
    {
      // 这是一条修改的数据
      __i__: 1
      action: 2,
      val: 4
    },
    {
      // 这是一条新增的数据
      action: 1,
      val: 5
    },
    {
      // 这是一条删除的数据
      action: 1,
      val: 5
    }
  ]
}

```

- 实现

```
const ACTION_TYPE = 'actionType'
const MARK = '__i__'
class Compare {
  Init (obj, __i__ = 1) {
    // 初始化数据，给数据添加__i__标记
  }
  Diff(oldTree, newTree) {
    // 对比旧树和新树，并且把数据的变更也反应到新树上

    let is = isEqual(oldTree, newTree) // 对比JSON对象是否有差异
    newTree[ACTION_TYPE] = is ? newTree[ACTION_TYPE] : UPDATE

    this.createAndUpdate(oldTree, newTree) // 新增数据和修改数据标记
    this.delete(oldTree, newTree) // 追加删除数据
  }
  createAndUpdate(oldTree, newTree) {
    // 添加新增和修改类型
  }
  delete(oldTree, newTree) {
    // 添加删除类型
  }
}
function isEqual(a, b) {
  return _.isEqual(a, b) // 参考underscore中isEqual的实现
}
```

源码地址：[https://github.com/carrollcai/tree-diff]()