import eventMixin from '@/utils/eventMixin'

class ElementSelect {
  constructor () {
    const hoverBox = document.createElement('div')
    hoverBox.style.position = 'absolute'
    // change to whatever highlight color you want
    hoverBox.style.background = 'lightblue'
    hoverBox.style.opacity = 0.3
    hoverBox.style.pointerEvents = 'none'
    // avoid blocking the hovered element and its surroundings
    hoverBox.style.zIndex = '9999'
    this.hoverBox = hoverBox
    this.handleMouseOver = e => {
      const target = e.target
      const targetOffset = target.getBoundingClientRect()
      const targetHeight = targetOffset.height
      const targetWidth = targetOffset.width
      // add a border around hover box
      const boxBorder = 5
      hoverBox.style.width = targetWidth + boxBorder * 2 + 'px'
      hoverBox.style.height = targetHeight + boxBorder * 2 + 'px'
      // need scrollX and scrollY to account for scrolling
      hoverBox.style.top = targetOffset.top + window.scrollY - boxBorder + 'px'
      hoverBox.style.left =
        targetOffset.left + window.scrollX - boxBorder + 'px'
    }

    this.handleClick = e => {
      this.trigger('select', e)
      e.stopPropagation()
      e.preventDefault()
    }
  }

  enable () {
    document.body.appendChild(this.hoverBox)
    document.addEventListener('mouseover', this.handleMouseOver, true)
    window.addEventListener('click', this.handleClick, true)
    this.trigger('enable')
    return this
  }

  disable () {
    this.hoverBox.remove()
    document.removeEventListener('mouseover', this.handleMouseOver, true)
    window.removeEventListener('click', this.handleClick, true)
    this.trigger('disable')
    return this
  }
}

Object.assign(ElementSelect.prototype, eventMixin)

export default new ElementSelect()
