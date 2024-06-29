import HTML from '@datkat21/html'
import { Page } from '../utils'
import dedent from 'dedent'

const Settings = (body: HTMLElement): void => {
  const container = Page(body)
    .styleJs({
      height: '100%',
      color: 'var(--text)'
    })

  new HTML('style')
    .text(dedent`
      * {
        font-family: 'Overused Grotesk', sans-serif;
      }

      input {
        margin-bottom: 1rem;
        padding: 0.5rem;
        border: none;
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text);
        border-radius: 0.5rem;  
      }

      label {
        display: block;
      }
    `)
    .appendTo(container)

  new HTML('h2').text('Theme').appendTo(container)

  new HTML('label').text('Main Color').appendTo(container)
  new HTML('input')
    .attr({
      type: 'text',
      value: document.body.style.getPropertyValue('--main')
    })
    .on('input', (e: Event) => {
      document.body.style.setProperty('--main', (e.target as HTMLInputElement).value)
      document.dispatchEvent(new Event('themechange'))
      window.localStorage.setItem('theme', `${document.body.style.getPropertyValue('--main')}|||${document.body.style.getPropertyValue('--text')}`)
    })
    .appendTo(container)

  new HTML('br').appendTo(container)

  new HTML('label').text('Text Color').appendTo(container)
  new HTML('input')
    .attr({
      type: 'text',
      value: document.body.style.getPropertyValue('--text')
    })
    .on('input', (e: Event) => {
      document.body.style.setProperty('--text', (e.target as HTMLInputElement).value)
      document.dispatchEvent(new Event('themechange'))
      window.localStorage.setItem('theme', `${document.body.style.getPropertyValue('--main')}|||${document.body.style.getPropertyValue('--text')}`)
    })
    .appendTo(container)
}

export default Settings
