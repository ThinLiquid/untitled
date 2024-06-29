import HTML from '@datkat21/html'
import { SetTransport } from '@mercuryworkshop/bare-mux'

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

  await SetTransport('EpxMod.EpoxyClient', { wisp: 'wss://wisp.mercurywork.shop' })
}

export const applyTheme = (): void => {
  const theme = (localStorage.getItem('theme') ?? 'black,#cdd6f4').split(',')
  if (theme != null) {
    document.documentElement.style.setProperty('--main', theme[0])
    document.documentElement.style.setProperty('--text', theme[1])
  }
}

export const search = (input: string, template: string): string => {
  try {
    return new URL(input).toString()
  } catch (err) {}

  try {
    const url = new URL(`http://${input}`)
    if (url.hostname.includes('.')) return url.toString()
  } catch (err) {}

  return template.replace('%s', encodeURIComponent(input))
}

export const Icon = (name: string): HTML => new HTML('i')
  .class('material-symbols-rounded')
  .text(name)

export const getFavicon = (url: string): string => `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`
export const getIFrameWindow = (iframe: HTML | HTMLIFrameElement): Window => {
  if (iframe instanceof HTML) return (iframe.elm as HTMLIFrameElement).contentWindow as Window
  return iframe.contentWindow as Window
}
