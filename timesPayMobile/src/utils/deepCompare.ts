export const deepCompare = (a, b) => {
  if (a != null && b != null) {
    let aKey = Object.keys(a);
    let bKey = Object.keys(b);
    for (let key in aKey) {
      if (a[aKey[key]] != null && b[bKey[key]] != null) {
        if (Object.keys(a[aKey[key]]).length > 1) {
          if (!deepCompare(a[aKey[key]], b[bKey[key]])) {
            return false;
          };
        } else {
          if (a[aKey[key]] != b[bKey[key]]) {
            return false;
          }
        }
      } else {
        if (a[aKey[key]] == null && b[bKey[key]] == null) {
          return true;
        } else {
          return false;
        }
      }
    }
  } else {
    if (a == null & b == null) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}
