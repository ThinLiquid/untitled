import HTML from '../html'

export default (icon: string, size: number, fill: boolean = false): HTML => new HTML('i')
  .class('material-symbols-rounded')
  .text(icon)
  .styleJs({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    fontVariationSettings: `'FILL' ${fill ? '1' : '0'}, 'OPSZ' ${size}`,
    fontSize: `${size}px`
  })
