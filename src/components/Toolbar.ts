import HTML from '../html'
import Icon from './Icon'
import OmniTool from './OmniTool'

export const ToolbarIcon = (icon: string, alt: string): HTML => Icon(icon, 20)
  .attr({
    title: alt
  })
  .styleJs({
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer'
  })

export const ToolbarIconGroup = (...children: HTML[]): HTML => new HTML('div')
  .styleJs({
    display: 'flex',
    gap: '16px'
  })
  .appendMany(...children)

export const ToolbarInvisibleDivider = (): HTML => new HTML('div')
  .style({
    width: '0px'
  })

export const ToolbarSpacer = (): HTML => new HTML('div')
  .style({
    flex: '1'
  })

export const ToolbarInput = (): HTML => new HTML('div')
  .styleJs({
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    width: '250px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    color: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    padding: '0 8px',
    gap: '8px'
  })
  .appendMany(
    Icon('lock', 14, true)
      .styleJs({
        color: 'rgba(255,255,255,0.7)'
      }),
    new HTML('input')
      .styleJs({
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        flex: '1',
        outline: 'none',
        textAlign: 'center',
        fontSize: '13px',
        lineHeight: '14px',
        pointerEvents: 'none'
      })
      .class('toolbar-input')
      .attr({
        placeholder: 'Search or enter website URL'
      }),
    Icon('link', 14, true)
      .styleJs({
        color: 'rgba(255,255,255,0.7)'
      })
      .on('click', (e) => {
        e.stopPropagation()
        const input = document.querySelector('.toolbar-input') as HTMLInputElement
        input.select()
        document.execCommand('copy')
      })
  )
  .on('click', (e) => {
    e.stopPropagation()
    new OmniTool('current')
  })

export default (): HTML => new HTML('div')
  .styleJs({
    display: 'flex',
    alignItems: 'center',
    height: '52px',
    margin: '0 20px',
    gap: '16px',
    position: 'relative'
  })
