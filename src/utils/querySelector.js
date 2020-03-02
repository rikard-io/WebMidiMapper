function checkParent (el) {
  let _el = el
  while (_el && _el !== document.body) {
    if (_el.id === 'wmm__app__') return false
    _el = _el.parentNode
  }
  return true
}
export default function querySelector (query) {
  if (query === 'window') return [window]
  if (query === 'document') return [document]
  if (query === 'body') return [document.body]
  try {
    const elements = document.querySelectorAll(query)
    return Array.prototype.filter.call(elements, el => checkParent(el))
  } catch (e) {}
  return []
}
