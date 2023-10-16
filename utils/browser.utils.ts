
function removeExtraSlashes (url: string) {
  return url.replace(/\/{2,}/gu, '/')
}

export const isBrowser = typeof document !== 'undefined'

export function getPath (url = '', addLang = '') {
  let path = (url === '' && /* c8 ignore next */isBrowser) ? document.location.pathname : url
  path = removeExtraSlashes(path)
  path = path.replace(/^\/[a-z]{2}\//u, '/') // remove any lang from path
  if (addLang !== '') path = `/${addLang}/${path}` // add target lang to path
  return removeExtraSlashes(path)
}

export function getPage (url = '') {
  const path = getPath(url).slice(1)
  if (path === '') return 'index'
  return path.split('.')[0] /* c8 ignore next */ ?? ''
}
