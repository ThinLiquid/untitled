import HTML from '@datkat21/html'
import { Icon } from '../utils'

export default class MultiButton {
  private readonly element: HTML

  constructor (icon: string, onClick: () => any) {
    this.element = new HTML('div')
      .class('mini-side')
      .append(
        Icon(icon)
      )
      .on('click', onClick)
  }

  render (): HTML {
    return this.element
  }
}
