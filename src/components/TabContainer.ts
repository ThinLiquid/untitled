import HTML from '@datkat21/html'

export default class TabContainer {
  private readonly element: HTML

  constructor () {
    this.element = new HTML('div').class('box')
  }

  add (element: HTML): this {
    this.element.append(element)
    return this
  }

  render (): HTML {
    return this.element
  }
}
