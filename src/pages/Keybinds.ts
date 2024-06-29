import HTML from '@datkat21/html'
import { Page } from '../utils'
import dedent from 'dedent'

const Keybinds = (body: HTMLElement): void => {
  const container = Page(body)
    .styleJs({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: 'var(--text)'
    })

  new HTML('style')
    .text(dedent`
      h3 {
        font-family: 'Overused Grotesk', sans-serif;
      }
    `)
    .appendTo(container)

  new HTML('h3').text('mouse controls').appendTo(container)
  new HTML('pre')
    .append(
      new HTML('code').text(dedent`
        left click: select tab
        right click: close tab
      `)
    )
    .appendTo(container)

  new HTML('h3').text('keybinds').appendTo(container)
  new HTML('pre')
    .append(
      new HTML('code').text(dedent`
        ctrl + arrow up: focus previous tab
        ctrl + arrow down: focus next tab
        ctrl + alt + t: open new tab
        ctrl + alt + w: close tab

        ctrl + arrow left: go back
        ctrl + arrow right: go forward
        ctrl + r: reload page

        alt + arrow up: select input bar
        alt + arrow down: focus active tab
        alt + arrow left: toggle sidebar
      `)
    )
    .appendTo(container)
}

export default Keybinds
