const DELETE = 0
const CREATE = 1
const UPDATE = 2
const UNCHANGED = 3

const ACTION_TYPE = 'action'
const MARK = '__i__'

/* 
 * 整体思路
 * 1、先给oldTree加上标记MARK
 * 2、复制oldTree，并对oldTree进行增删改操作，生成newTree
 * 3、oldTree和newTree进行对比，把差异追加到newTree上
 * 4、最终数据的变化ACTION_TYPE会体现在数据上
 */

class Compare {
  Init(obj, index = 1) {
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj) && obj.length > 0) {
        obj.forEach((val, ci) => {
          val[MARK] = ci
          this.Init(val, ci + index)
        })
      } else {
        obj[MARK] = index
        for (let val in obj) {
          this.Init(obj[val], index)
        }
      }
    }
  }
  Diff(oldTree, newTree) {
    let is = isEqual(oldTree, newTree)
    newTree[ACTION_TYPE] = is ? newTree[ACTION_TYPE] : UPDATE

    this.createAndUpdate(oldTree, newTree) // 新增数据和修改数据标记
    this.delete(oldTree, newTree) // 追加删除数据
  }
  createAndUpdate(oldTree, newTree) {
    for (let x in newTree) {
      if (Array.isArray(newTree[x]) && newTree[x].length > 0) {
        newTree[x].forEach(nval => {
          if (!nval[MARK]) {
            nval[ACTION_TYPE] = CREATE
          }
        })
      } else {
        // 判断数据是否修改了
        // 判断子对象是{}对象
        if (typeof newTree[x] === 'object' && typeof oldTree[x] === 'object') {
          let is = isEqual(oldTree[x], newTree[x])
          newTree[x][ACTION_TYPE] = is ? newTree[x][ACTION_TYPE] : UPDATE
        }
      }
      if (typeof newTree[x] === 'object' && typeof oldTree[x] === 'object') {
        this.createAndUpdate(oldTree[x], newTree[x])
      }
    }
  }
  delete(oldTree, newTree) {
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
      this.delete(oldTree[y], newTree[y])
    }
  }
}

// 要实现JSON的递归判断
function isEqual(a, b) {
  const isFunction = obj => typeof obj == 'function' || false
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  if (a === b) return a !== 0 || 1 / a === 1 / b

  // A strict comparison is necessary because `null == undefined`.
  if (a == null || b == null) return a === b

  let className = toString.call(a)
  if (className !== toString.call(b)) return false

  switch (className) {
    case '[object RegExp]':

    case '[object String]':
      //`"5"` is equivalent to `new String("5")`.
      return '' + a === '' + b
    case '[object Number]':
      // Object(NaN) is equivalent to NaN
      if (+a !== +a) return +b !== +b
      return +a === 0 ? 1 / +a === 1 / b : +a === +b
    case '[object Date]':

    case '[object Boolean]':
      return +a === +b;
  }

  // className includes '[object Array]', '[object Object]' or '[object Function]'
  let areArrays = className === '[object Array]'

  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && 
      !(isFunction(aCtor) && 
      aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && 
      ('constructor' in a && 'constructor' in b)) {
      return false
    }
  }

  let length = 0
  if (areArrays) {
    length = a.length
    if (length !== b.length) return false
    while (length--) {
      if (!isEqual(a[length], b[length])) return false
    }
  } else {
    let keys = Object.keys(a)
    length = keys.length
    if (Object.keys(b).length !== length) return false
    while (length--) {
      key = keys[length]
      if (!(b.hasOwnProperty(key) && isEqual(a[key], b[key]))) return false
    }
  }
  return true
}