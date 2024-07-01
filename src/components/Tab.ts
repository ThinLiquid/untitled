import HTML from '../html'
import Icon from './Icon'

export const TabImage = (url: string): HTML => new HTML('img')
  .attr({
    src: url
  })
  .styleJs({
    width: '16px',
    height: '16px'
  })

export const TabImageIcon = (icon: string): HTML => Icon(icon, 20)
  .styleJs({
    color: 'rgba(255,255,255,0.7)'
  })

export const TabLabel = (text: string): HTML => new HTML('span')
  .styleJs({
    fontSize: '13.5px',
    color: 'rgba(255,255,255,0.7)',
    flex: '1',
    fontWeight: '500',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  })
  .text(text)

export const TabIcon = (icon: string): HTML => Icon(icon, 24)
  .class('icon')
  .styleJs({
    padding: '2px',
    color: 'rgba(255,255,255,0.4)',
    borderRadius: '6px'
  })
