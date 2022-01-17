export function getLastVersion(versions) {
  if (!versions || versions.length <= 0) {
    return ''
  }
  let maxVersion = []
  let res = ''
  versions.forEach((version, index) => {
    const arr = version.split(/[^\d]+/).slice(1)
    console.log(arr)
    for (const i in arr) {
      if (!maxVersion[i] || +arr[i] > +maxVersion[i]) {
        maxVersion = arr
        res = index
        return
      }
      if (+arr[i] === +maxVersion[i]) continue
      break
    }
    return
  })
  return versions[res]
}
