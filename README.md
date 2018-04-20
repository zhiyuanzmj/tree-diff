### 实现新旧JSON树的对比，将数据的变化反映到新的JSON树上

- 例如新增一条数据
```js
  let oldArr = [
    {
      a: 1
    }
  ]
  let newArr = [
    {
      a: 1,
    },
    {
      b: 2
    }
  ]
  => 
  let newArr = [
    {
      a: 1,
      actionType: 3 // 状态不变
    },
    {
      b: 2,
      actionType: 1 // 新增
    }
  ]
```