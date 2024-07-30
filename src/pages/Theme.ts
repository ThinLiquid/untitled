import HTML from '../html'
import { Page } from '../utils'

const Theme = (body: HTMLElement): void => {
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
      .text('Theme'),
    new HTML('input')
      .style({
        background: 'none',
        border: 'none',
        width: '100px'
      })
      .attr({ type: 'color', value: window.localStorage.getItem('theme') ?? '#1e1e2e' })
      .on('input', (e) => {
        window.localStorage.setItem('theme', e.target.value)
        window.dispatchEvent(new Event('theme'))
        setColor(e.target.value)
      })
  )
}

export const setColor = (color: string): string[] => {
  const rgb = (color.match(/\w\w/g) as any).map((v: string) => parseInt(v, 16))

  const adjustBrightness = (value: number, adjustment: number): number => {
    let newValue = value + adjustment
    if (newValue < 0) newValue = 0
    if (newValue > 255) return 255
    return newValue
  }

  // Calculate perceived brightness
  const perceivedBrightness = Math.sqrt(
    0.299 * (rgb[0] * rgb[0]) +
    0.587 * (rgb[1] * rgb[1]) +
    0.114 * (rgb[2] * rgb[2])
  )

  const adjustment = perceivedBrightness > 145 ? -60 : -40
  const adjustment2 = perceivedBrightness > 145 ? -70 : -50

  const newRgb: number[] = rgb.map((v: number) => adjustBrightness(v, adjustment))
  const newColor: string = newRgb.map((v) => v.toString(16).padStart(2, '0')).join('')

  const newRgb2: number[] = rgb.map((v: number) => adjustBrightness(v, adjustment2))
  const newColor2: string = newRgb2.map((v) => v.toString(16).padStart(2, '0')).join('')

  document.body.style.setProperty('--theme', `#${newColor}`)
  document.body.style.setProperty('--theme2', `#${newColor2}`)

  return [newColor, newColor2]
}

export default Theme
