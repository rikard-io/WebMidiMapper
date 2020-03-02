export default function getDomPath (el) {
  var stack = []
  while (el.parentNode !== null) {
    var sibCount = 0
    var sibIndex = 0
    for (var i = 0; i < el.parentNode.childNodes.length; i++) {
      var sib = el.parentNode.childNodes[i]
      if (sib.nodeName === el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount
        }
        sibCount++
      }
    }
    if (el.hasAttribute('id') && el.id !== '') {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id)
      // we can break here as Id should be enough of a starting point for selector
      return stack.join(' ')
    } else if (sibCount > 1) {
      stack.unshift(
        el.nodeName.toLowerCase() + ':nth-child(' + (sibIndex + 1) + ')'
      )
    } else {
      stack.unshift(el.nodeName.toLowerCase())
    }
    el = el.parentNode
  }
  return stack.slice(1).join(' ') // removes the html element
}
