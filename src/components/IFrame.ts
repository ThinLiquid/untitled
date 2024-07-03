import HTML from '../html'

export default class IFrame {
  element: HTML

  constructor () {
    this.element = new HTML('iframe')
      .styleJs({
        background: 'white',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        border: 'none',
        height: '100%',
        width: '100%',
        display: 'none'
      })
  }

  getSource (): string | null {
    return this.element.elm.getAttribute('src')
  }

  setSource (url: string): this {
    this.element.attr({ src: url })
    return this
  }

  getWindow (): Window {
    return (this.element.elm as HTMLIFrameElement).contentWindow as Window
  }

  getDocument (): Document {
    return (this.element.elm as HTMLIFrameElement).contentDocument as Document
  }

  on (event: string, callback: () => any): this {
    this.element.on(event, callback)
    return this
  }

  style (styles: Partial<CSSStyleDeclaration>): this {
    this.element.styleJs(styles as any)
    return this
  }

  appendTo (elm: HTML): this {
    this.element.appendTo(elm)
    return this
  }
}
