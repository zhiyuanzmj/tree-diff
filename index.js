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
var tree = new Compare()
tree.Init(oldTree)
tree.Diff(oldTree, newTree)
console.log(newTree)