import HTML from '@datkat21/html'

export default class IFrame {
  private readonly element: HTML

  constructor (src: string, onLoad: () => any) {
    this.element = new HTML('iframe')
      .class('iframe')
      .attr({ src })
      .on('load', onLoad)
  }

  render (): HTML {
    return this.element
  }
}
