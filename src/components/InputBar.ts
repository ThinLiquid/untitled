import HTML from '@datkat21/html'

export default class InputBar {
  private readonly element: HTML

  constructor (placeholder: string, onEnter: (value: string) => any) {
    this.element = new HTML('input')
      .class('side')
      .attr({ placeholder })
      .on('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
          onEnter(((e as KeyboardEvent).target as HTMLInputElement).value)
        }
      })
  }

  val (value: string): InputBar {
    this.element.val(value)
    return this
  }

  focus (): InputBar {
    this.element.elm.focus()
    return this
  }

  render (): HTML {
    return this.element
  }
}
