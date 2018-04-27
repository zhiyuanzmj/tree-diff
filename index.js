let oldTree = {
  action: 3,
  first: 1,
  value: 1,
  array: [
    {
      action: 3,
      array1: 1
    },
  ],
  obj: {
    action: 3,
    value1111: 1,
  },
  children: {
    action: 3,
    second: 2,
    value: 1111,
    obj: {
      "action": 3,
      value: 11
    },
    array1: [
      {
        action: 3,
        arr1: 1,
      },
      {
        action: 3,
        arr2: 2111,
      }
    ],
    array2: [
      {
        action: 3,
        arr1: 1,
        children: {
          "action": 3,
          a: 11111
        },
      },
      {
        action: 3,
        arr2: 2,
      }
    ]
  }
}
let newTree = {
  "action": 3,
  "first": 1,
  "value": 1,
  "array": [
    {
      action: 3,
      "array1": 1111111,
      "__i__": 1
    },
    {
      value: 11
    }
  ],
  "obj": {
    "action": 3,
    "value1111": null,
    "__i__": 1
  },
  "children": {
    "action": 3,
    "second": 2,
    "value": 2,
    obj: {
      "action": 3,
      value: 22222
    },
    "array1": [
      {
        "action": 3,
        "arr1": 1,
        "__i__": 1
      },
    ],
    "array2": [
      {
        "action": 3,
        "arr1": 1,
        children: {
          "action": 3,
          a: 1,
          "__i__": 1
        },
        "__i__": 1
      },
      {
        "action": 3,
        "arr2": 211,
        "__i__": 2
      },
      {
        "action": 3,
        "arr3": 2,
      }
    ],
    "__i__": 1
  },
  "__i__": 1
}
const tree = new Compare()
tree.Init(oldTree)
tree.Diff(oldTree, newTree)
console.log(newTree)