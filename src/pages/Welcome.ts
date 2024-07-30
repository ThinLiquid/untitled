import dedent from 'dedent'
import HTML from '../html'
import { Page } from '../utils'

const NewTab = async (body: HTMLElement): Promise<void> => {
  const container = Page(body)

  container.appendMany(
    new HTML('div')
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
      .appendMany(
        new HTML('h1')
          .styleJs({
            fontSize: '56px',
            margin: '0'
          })
          .text('untitled.'),
        new HTML('p')
          .text('press alt+t to open a new tab.'),
        new HTML('p')
          .styleJs({
            textAlign: 'left',
            background: 'rgba(0,0,0,0.1)',
            padding: '10px',
            borderRadius: '5px',
            opacity: '0.8'
          })
          .text(dedent`
            untitled://welcome   - the welcome page
            untitled://shortcuts - the keyboard shortcuts page
            untitled://theme     - the theme settings page
          `)
      )
  )
}

export default NewTab
