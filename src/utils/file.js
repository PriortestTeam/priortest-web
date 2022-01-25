/**
 * 选择文件
 * @param _options
 * @returns {Promise<unknown>}
 */
export function selectFile (_options) {
  return new Promise((res, rej) => {
    const options = {
      accept: 'image/*',
      multiple: true
    }

    if (_options) {
      options.accept = _options.accept
      options.multiple = _options.multiple
    }

    const el = document.createElement('input')
    el.type = 'file'
    el.accept = options.accept
    el.multiple = options.multiple
    el.addEventListener('change', e => {
      if (options.multiple) {
        res({ file: el.files, url: el.value })
      } else {
        res({ file: el.files[0], url: el.value })
      }
    })
    el.click()
  })
}
