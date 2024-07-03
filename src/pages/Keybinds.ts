import HTML from '../html'
import { Page } from '../utils'

const Keybinds = (body: HTMLElement): void => {
  const container = Page(body)

  container.appendMany(
    new HTML('div')
      .text('Keybinds')
  )
}

export default Keybinds
