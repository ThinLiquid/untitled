import HTML from '../html'
import { Page, search } from '../utils'

const NewTab = async (body: HTMLElement): Promise<void> => {
  console.log('hi')
  body.style.backgroundColor = '#1e1e2e'
  const container = Page(body)

  const importStyle = async (url: string): Promise<void> => await new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = url
    link.onload = () => {
      link.rel = 'stylesheet'
      resolve()
    }
    link.onerror = reject
    body.appendChild(link)
  })

  console.log('hi')

  await importStyle((await import('./input.css?url')).default)
  await importStyle('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap')

  container.appendMany(
    new HTML('div')
      .styleJs({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'conic-gradient(#f38ba8, #f9e2af, #a6e3a1, #74c7ec, #b4befe, #f38ba8)',
        borderRadius: '50%',
        width: '500px',
        height: '500px',
        filter: 'blur(100px)',
        opacity: '0.5',
        animation: 'rotate 10s infinite linear'
      }),
    new HTML('div')
      .styleJs({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      })
      .appendMany(
        new HTML('h1')
          .styleJs({
            fontSize: '56px',
            margin: '0'
          })
          .text('untitled.'),
        new HTML('p')
          .styleJs({
            fontSize: '20px',
            margin: '0'
          })
          .text('A simple, elegant browser.'),
        new HTML('br'),
        new HTML('input')
          .attr({
            placeholder: 'Search or enter website URL'
          })
          .styleJs({
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.1)',
            width: '500px',
            maxWidth: 'calc(100% - 20px)',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            color: 'rgba(255,255,255,0.7)',
            alignItems: 'center',
            padding: '0 8px',
            marginTop: '10px'
          })
          .on('keydown', (e) => {
            const event = e as KeyboardEvent
            if (event.key !== 'Enter') return

            const { value } = (e.target as HTMLInputElement)
            const a = document.createElement('a')
            a.href = search(value, window.searchEngine)
            body.appendChild(a)
            a.click()
            body.removeChild(a)
          })
      )
  )
}

export default NewTab
