let oldTree = {
  actionType: 3,
  first: 1,
  value: 1,
  array: [
    {
      actionType: 3,
      array1: 1
    },
  ],
  obj: {
    actionType: 3,
    value: 1,
  },
  children: {
    actionType: 3,
    second: 2,
    value: 1111,
    obj: {
      "actionType": 3,
      value: 11
    },
    array1: [
      {
        actionType: 3,
        arr1: 1,
      },
      {
        actionType: 3,
        arr2: 2111,
      }
    ],
    array2: [
      {
        actionType: 3,
        arr1: 1,
        children: {
          "actionType": 3,
          a: 1
        },
      },
      {
        actionType: 3,
        arr2: 2,
      }
    ]
  }
}
let newTree = {
  "actionType": 3,
  "first": 1,
  "value": 1,
  "array": [
    {
      actionType: 3,
      "array1": 1111111,
      "__i": 1
    },
    {
      value: 11
    }
  ],
  "obj": {
    "actionType": 3,
    "value": null,
    "__i": 1
  },
  "children": {
    "actionType": 3,
    "second": 2,
    "value": 2,
    obj: {
      "actionType": 3,
      value: 22222
    },
    "array1": [
      {
        "actionType": 3,
        "arr1": 1,
        "__i": 1
      },
    ],
    "array2": [
      {
        "actionType": 3,
        "arr1": 1,
        children: {
          "actionType": 3,
          a: 1,
          "__i": 1
        },
        "__i": 1
      },
      {
        "actionType": 3,
        "arr2": 211,
        "__i": 2
      },
      {
        "actionType": 3,
        "arr3": 2,
      }
    ],
    "__i": 1
  },
  "__i": 1
}

const DELETE = 0
const CREATE = 1
const UPDATE = 2
const UNCHANGED = 3

const ACTION_TYPE = 'actionType'
const MARK = '__i'

/* 
 * 整体思路，
 * 1、先给oldTree加上标记MARK
 * 2、复制oldTree，并对oldTree进行增删改操作，生成newTree
 * 3、oldTree和newTree进行对比，把差异追加到newTree上
 * 4、最终数据的变化ACTION_TYPE会体现在数据上
 */

Init(oldTree)
Diff(oldTree, newTree)
console.log(newTree)

function Init(obj, index = 1) {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj) && obj.length > 0) {
      obj.forEach((val, ci) => {
        val[MARK] = ci
        Init(val, ci + index)
      })
    } else {
      obj[MARK] = index
      for (let val in obj) {
        Init(obj[val], index)
      }
    }
  }
}

function Diff(oldTree, newTree) {
  newTree[ACTION_TYPE] = UPDATE
  remove(oldTree, newTree)
  add(oldTree, newTree)
}
function remove(oldTree, newTree) {
  for (let x in newTree) {
    if (Array.isArray(newTree[x]) && newTree[x].length > 0) {
      newTree[x].forEach(nval => {
        if (!nval[MARK]) {
          nval[ACTION_TYPE] = CREATE
        }
      })
    } else {
      // 子对象是否改变
      if (typeof newTree[x] === 'object' && typeof oldTree[x] === 'object') {
        let is = isEqual(oldTree[x], newTree[x])
        newTree[x][ACTION_TYPE] = is ? newTree[x][ACTION_TYPE] : UPDATE
      }
    }
    if (typeof newTree[x] === 'object' && typeof oldTree[x] === 'object') {
      remove(oldTree[x], newTree[x])
    }
  }
}
function add(oldTree, newTree) {
  for (let y in oldTree) {
    if (Array.isArray(oldTree[y]) && oldTree[y].length > 0) {
      let arr = []
      oldTree[y].forEach(oval => {
        const len = newTree[y].filter(nval => oval[MARK] === nval[MARK]).length
        if (!len) {
          // delete
          oval[ACTION_TYPE] = DELETE
          arr.push(oval)
        }
      })
      if (arr.length) {
        newTree[y] = newTree[y].concat(arr)
      }
    }
    add(oldTree[y], newTree[y])
  }
}

// 要实现JSON的递归判断
function isEqual(a, b) {
  if (!a || !b) {
    return a === b
  }
  if (a === b) {
    return true
  }
  // Of course, we can do it use for in 
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}