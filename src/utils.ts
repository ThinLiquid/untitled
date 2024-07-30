import HTML from './html'

export const loadScript = async (src: string): Promise<void> => await new Promise((resolve, reject) => {
  const script = document.createElement('script')
  script.src = src
  script.onload = () => resolve()
  script.onerror = reject
  document.head.appendChild(script)
})

export const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker is not supported')
  }

  await navigator.serviceWorker.register('uv/sw.js')

  await window.BareMux.SetTransport('EpxMod.EpoxyClient', { wisp: 'wss://wisp.mercurywork.shop' })
}

export const search = (input: string, template: string): string => {
  try {
    return new URL(input).toString()
  } catch (err) {}

  try {
    const url = new URL(`http://${input}`)
    if (url.hostname.includes('.')) return url.toString()
  } catch (err) {}

  if (input.startsWith('about:')) return input

  return window.__uv$config.prefix + window.__uv$config.encodeUrl(template.replace('%s', encodeURIComponent(input)))
}

export const Page = (body: HTMLElement): HTML => {
  const _container = document.createElement('div')
  body.appendChild(_container as HTMLElement)
  body.style.backgroundColor = darkenHex(document.body.style.getPropertyValue('--theme'))
  window.addEventListener('theme', () => {
    body.style.backgroundColor = darkenHex(document.body.style.getPropertyValue('--theme'))
  })
  return new HTML(_container)
}

export const darkenHex = (hex: string): string => {
  const rgb = (hex.match(/\w\w/g) as any).map((v: string) => parseInt(v, 16))

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

  const newRgb: number[] = rgb.map((v: number) => adjustBrightness(v, adjustment))
  const newColor: string = newRgb.map((v) => v.toString(16).padStart(2, '0')).join('')

  return `#${newColor}`
}
