/* eslint-disable no-new */

import HTML from '../html'
import Tab from '../others/Tab'
import { search } from '../utils'

export default class OmniTool {
  element: HTML
  constructor (type: 'newtab' | 'current') {
    this.element = new HTML('div')
      .styleJs({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '15px',
        zIndex: '100',
        flexDirection: 'column',
        gap: '10px',
        overflow: 'hidden',
        opacity: '1',
        display: 'flex',
        transition: 'opacity 0.5s'
      })
      .appendMany(
        new HTML('div')
          .styleJs({
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            margin: '0 7.5px'
          })
          .appendMany(
            new HTML('i')
              .class('material-symbols-rounded')
              .text('search')
              .styleJs({
                color: 'rgba(255,255,255,0.7)',
                padding: '10px',
                fontSize: '24px'
              }),
            new HTML('input')
              .styleJs({
                border: 'none',
                background: 'transparent',
                width: '500px',
                height: '32px',
                display: 'flex',
                color: 'rgba(255,255,255,0.7)',
                alignItems: 'center',
                padding: '30px 10px',
                fontSize: '16px',
                outline: 'none'
              })
              .on('blur', () => this.remove())
              .on('keydown', async (e) => {
                if (e.key === 'Enter') {
                  if (type === 'newtab') {
                    new Tab(search((e.target as HTMLInputElement).value, window.searchEngine))
                  } else {
                    window.currentTab.iframe.setSource(search((e.target as HTMLInputElement).value, window.searchEngine))
                  }
                  this.remove()
                  return
                } else if (e.key === 'Escape') {
                  this.remove()
                  return
                }
                const res = await fetch(`https://corsproxy.io?https://suggestqueries.google.com/complete/search?client=firefox&q=${(e.target as HTMLInputElement).value}`)
                const data = await res.json()
                this.element.qs('.results')?.clear()
                let i = 0
                for (const result of data[1]) {
                  if (i > 3) break
                  this.element.qs('.results')?.append(
                    new HTML('div')
                      .class('result')
                      .styleJs({
                        display: 'flex',
                        alignItems: 'center',
                        margin: '0 7.5px',
                        padding: '5px'
                      })
                      .appendMany(
                        new HTML('i')
                          .class('material-symbols-rounded')
                          .text('search')
                          .styleJs({
                            color: 'rgba(255,255,255,0.7)',
                            padding: '5px',
                            fontSize: '24px'
                          }),
                        new HTML('span')
                          .text(result)
                          .styleJs({
                            color: 'rgba(255,255,255,0.7)',
                            padding: '10px',
                            fontSize: '16px'
                          })
                      )
                      .on('click', () => {
                        if (type === 'newtab') {
                          new Tab(search(result, window.searchEngine))
                        } else {
                          window.currentTab.iframe.setSource(search(result, window.searchEngine))
                        }
                      })
                  )
                  i++
                }
              })
          ),
        new HTML('div')
          .class('results')
          .styleJs({
            display: 'flex',
            flexDirection: 'column',
            marginTop: '-10px'
          })
      )

    new HTML(document.body).append(this.element)
    this.element.qs('input')?.elm.focus()
  }

  remove (): void {
    this.element.style({ opacity: '0' })
    setTimeout(() => {
      this.element.cleanup()
    }, 500)
  }
}
