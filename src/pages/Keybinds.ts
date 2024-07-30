import dedent from 'dedent'
import HTML from '../html'
import { Page } from '../utils'

const Keybinds = (body: HTMLElement): void => {
  body.style.backgroundColor = 'var(--theme)'
  const container = Page(body)
    .styleJs({
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'Menlo, monospace',
      textAlign: 'center'
    })

  container.appendMany(
    new HTML('h1')
      .text('Shortcuts'),
    new HTML('p')
      .styleJs({
        textAlign: 'left',
        background: 'rgba(0,0,0,0.1)',
        padding: '10px',
        borderRadius: '5px',
        opacity: '0.8'
      })
      .text(dedent`
        alt + t - new tab
        alt + ⬆️ - previous tab
        alt + ⬇️ - next tab
        alt + ⬅️ - back
        alt + ➡️ - forward

        ctrl + s - toggle sidenav
        ctrl + r - reload
      `)
  )
}

export default Keybinds
