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
  return new HTML(_container)
}
