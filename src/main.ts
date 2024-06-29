import 'material-symbols'
import './style.scss'

import HTML from '@datkat21/html'
import {
  Icon,
  applyTheme,
  getFavicon,
  getIFrameWindow,
  loadScript,
  registerServiceWorker,
  search
} from './utils'

import { v4 as uuid } from 'uuid'

import Settings from './pages/Settings'
import Keybinds from './pages/Keybinds'

import TabContainer from './components/TabContainer'
import SideBar from './components/SideBar'
import SideBarButton from './components/SideBarButton'
import IFrameContainer from './components/IFrameContainer'
import IFrame from './components/IFrame'
import MultiButton from './components/MultiButton'
import MultiButtonContainer from './components/MultiButtonContainer'
import InputBar from './components/InputBar'

declare global {
  interface Window {
    __uv$config: {
      prefix: string
      encodeUrl: (url: string) => string
      decodeUrl: (url: string) => string
    }
    BareMux: {
      SetTransport: (name: string, config: any) => Promise<void>
    }
  }
}

const body = new HTML(document.body)
const scripts = ['/baremux/bare.cjs', '/epoxy/index.js', '/uv/uv.bundle.js', '/uv/uv.config.js']

let activeTabIndex = -1

const closeTabAtIndex = (tab: {
  iframe: HTML
  button: HTML
  id: string
}): void => {
  const index = iframes.findIndex(iframe => iframe.id === tab.id)
  if (iframes.length > 1) {
    tab.button.cleanup()
    tab.iframe.cleanup()
    if (index === activeTabIndex) {
      if (index === iframes.length - 1) {
        focusIframe(index - 1)
      } else if (index === 0) {
        focusIframe(index + 1)
      } else {
        focusIframe(index)
      }
    }
    iframes.splice(index, 1)
    return
  }
  try {
    focusIframe(-1)
  } catch (err) {}
}

const handleKeybind = (e: KeyboardEvent): void => {
  if (e.key === 'ArrowUp' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    if (activeTabIndex !== -1 && activeTabIndex > 0) {
      focusIframe(activeTabIndex - 1)
    }
  } else if (e.key === 'ArrowDown' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    if (activeTabIndex !== -1 && activeTabIndex < iframes.length - 1) {
      focusIframe(activeTabIndex + 1)
    }
  } else if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    ;(getActiveTab().contentWindow as Window).history.back()
  } else if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    ;(getActiveTab().contentWindow as Window).history.forward()
  } else if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    if ((getActiveTab().contentWindow as Window).location.href.startsWith('about:')) {
      handleBuiltInPage(getActiveTab())
      return
    }
    ;(getActiveTab().contentWindow as Window).location.reload()
  } else if (e.key === 'ArrowUp' && e.altKey) {
    e.preventDefault()
    input.focus()
    input.select()
  } else if (e.key === 'ArrowLeft' && e.altKey) {
    e.preventDefault()
    sidebar.toggle()
  } else if (e.key === 'ArrowDown' && e.altKey) {
    e.preventDefault()
    getActiveTab().focus()
  } else if (e.key === 't' && e.ctrlKey && e.altKey) {
    e.preventDefault()
    createNewTab()
  } else if (e.key === 'w' && e.ctrlKey && e.altKey) {
    e.preventDefault()
    closeTabAtIndex(iframes[activeTabIndex])
  }
}

const iframes: Array<{
  iframe: HTML
  button: HTML
  id: string
}> = []

applyTheme()
window.addEventListener('keydown', handleKeybind)

for (const script of scripts) {
  await loadScript(script)
}

const builtInPages: {
  [key: string]: {
    icon: string
    page: (body: HTMLBodyElement) => void
  }
} = {
  'about:blank?settings': {
    icon: 'settings',
    page: Settings
  },
  'about:blank?keybinds': {
    icon: 'keyboard',
    page: Keybinds
  }
}

const handleBuiltInPage = (iframe: HTMLIFrameElement): void => {
  const url = getIFrameWindow(iframe).location.href as keyof typeof builtInPages
  if (builtInPages[url] != null) {
    builtInPages[url].page(iframe.contentDocument?.body as HTMLBodyElement)
  }
}

const handleIFrameLoad = (currentIndex: number): void => {
  const { iframe, button } = iframes[currentIndex]
  const _ = getIFrameWindow(iframe)

  _.addEventListener('keydown', handleKeybind)

  const url = window.__uv$config.decodeUrl(_.location.href.split(window.__uv$config.prefix)[1]) ?? _.location.href

  console.log(window.__uv$config.decodeUrl(_.location.href.split(window.__uv$config.prefix)[1]))

  button.html('')
  button.attr({ title: _.document.querySelector('title')?.textContent ?? 'Untitled' })
  if (url.startsWith('about:')) {
    button.append(Icon(builtInPages[url]?.icon))
    handleBuiltInPage(iframe.elm as HTMLIFrameElement)
  } else button.append(new HTML('img').attr({ src: getFavicon(url) }))

  if (activeTabIndex === currentIndex) {
    input.val(url)
  }
}

const createNewTab = (url: string = 'https://google.com'): void => {
  const id = uuid()
  const button = new SideBarButton(
    () => {
      focusIframe(iframes.findIndex(iframe => iframe.id === id))
    },
    (e: MouseEvent) => {
      e.preventDefault()
      closeTabAtIndex(iframes.find(iframe => iframe.id === id) ?? { iframe: new HTML('iframe'), button: new HTML('button'), id })
    },
    url.startsWith('about:') ? Icon(builtInPages[url]?.icon) : new HTML('img').attr({ src: getFavicon(url) })
  ).render()
  tabsContainer.add(button)

  const currentIndex = iframes.length

  const iframe = new IFrame(url.startsWith('about:') ? url : window.__uv$config.prefix + window.__uv$config.encodeUrl(url), () => {
    handleIFrameLoad(currentIndex)
  })
    .render()

  iframeContainer.add(iframe)
  iframes.push({ iframe, button, id })

  if (url.startsWith('about:')) {
    handleBuiltInPage(iframe.elm as HTMLIFrameElement)
  }

  focusIframe(currentIndex)
  getActiveTab().contentWindow?.addEventListener('keydown', handleKeybind)
}

const focusIframe = (index: number): void => {
  if (index === -1) {
    input.val('')
  }
  iframes.forEach((iframe, i) => {
    if (i !== index) {
      iframe.iframe.styleJs({ display: 'none' })
      iframe.button.classOff('active')
    }
  })
  if (activeTabIndex !== -1) {
    iframes[activeTabIndex].iframe.styleJs({ display: 'none' })
    iframes[activeTabIndex].button.classOff('active')
  }

  iframes[index].iframe.styleJs({ display: 'block' })
  iframes[index].button.classOn('active')
  activeTabIndex = index

  const url = getIFrameWindow(getActiveTab()).location.href
  input.val(
    url.startsWith(window.__uv$config.prefix) ? window.__uv$config.decodeUrl(url.split(window.__uv$config.prefix)[1]) : url
  )
}

const getActiveTab = (): HTMLIFrameElement => iframes[activeTabIndex].iframe.elm as HTMLIFrameElement

await registerServiceWorker()

const topbar = new HTML('div').class('topbar').appendTo(body)
const container = new HTML('div').class('container').appendTo(body)

const multiButton = new MultiButtonContainer()
  .add(new MultiButton('arrow_back', () => {
    getIFrameWindow(getActiveTab()).history.back()
    if ((getActiveTab().contentWindow as Window).location.href.startsWith('about:')) {
      handleBuiltInPage(getActiveTab())
    }
  }).render())
  .add(new MultiButton('arrow_forward', () => {
    getIFrameWindow(getActiveTab()).history.forward()
    if ((getActiveTab().contentWindow as Window).location.href.startsWith('about:')) {
      handleBuiltInPage(getActiveTab())
    }
  }).render())
  .add(new MultiButton('refresh', () => {
    if ((getActiveTab().contentWindow as Window).location.href.startsWith('about:')) {
      handleBuiltInPage(getActiveTab())
      return
    }
    ;(getActiveTab().contentWindow as Window).location.reload()
  }).render())

multiButton.render().appendTo(topbar)

const input = new InputBar('Search or type URL', (value: string) => {
  const _search = search(value, 'https://google.com/search?q=%s')
  if (!_search.startsWith('about:')) getIFrameWindow(getActiveTab()).location.href = _search

  if (activeTabIndex === -1) {
    createNewTab(_search)
  } else {
    if (getIFrameWindow(getActiveTab()).location.href.startsWith('about:')) {
      getActiveTab().src = _search
      return
    }
    getIFrameWindow(getActiveTab()).location.href = _search
  }
  getIFrameWindow(getActiveTab()).focus()
})

input.render().appendTo(topbar)

const tabsContainer = new TabContainer()
const sidebar = new SideBar()
  .add(new SideBarButton(() => createNewTab(), undefined, Icon('add')).render())
  .add(tabsContainer.render())
  .add(new SideBarButton(() => createNewTab('about:blank?settings'), undefined, Icon('settings')).render())

const iframeContainer = new IFrameContainer()

sidebar.render().appendTo(container)
iframeContainer.render().appendTo(container)

createNewTab('about:blank?keybinds')
