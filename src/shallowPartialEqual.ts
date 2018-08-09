/**
 * 帮助函数之部分比较。
 * 如果 objB 的 key 在 objA 中则比较两者，如果有不在的则返回 false
 */
const hasOwn = Object.prototype.hasOwnProperty

function is(x: any, y: any) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export default function shallowPartialEqual<O extends { [key: string]: any }>(objA: O, objB: O) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  for (let i = 0; i < keysB.length; i++) {
    if (!(keysA.indexOf(keysB[i]) > -1) || !is(objA[keysB[i]], objB[keysB[i]])) {
      return false
    }
  }

  return true
}