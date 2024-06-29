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
  }
}

const body = new HTML(document.body)
const scripts = ['/epoxy/index.js', '/uv/uv.bundle.js', '/uv/uv.config.js']

let activeTabIndex = -1

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
    ;(getActiveTab().contentWindow as Window).location.reload()
  } else if (e.key === 'ArrowUp' && e.altKey) {
    input.focus()
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

const handleIFrameLoad = (currentIndex: number): void => {
  const { iframe, button } = iframes[currentIndex]
  const _ = getIFrameWindow(iframe)

  _.addEventListener('keydown', handleKeybind)

  const url = window.__uv$config.decodeUrl(_.location.href.split(window.__uv$config.prefix)[1])

  button
    .html('')
    .append(getFavicon(new URL(url).hostname))
    .attr({ title: _.document.querySelector('title')?.textContent ?? 'Untitled' })

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
      iframes.splice(iframes.findIndex(iframe => iframe.id === id), 1)
      button.cleanup()
      iframe.cleanup()
      if (iframes.length > 1) {
        if (activeTabIndex === currentIndex) {
          focusIframe(0)
        }
      } else if (activeTabIndex === currentIndex) {
        try {
          focusIframe(-1)
        } catch (err) {}
      }
    },
    Icon('globe')
  ).render()
  tabsContainer.add(button)

  const iframe = new IFrame(window.__uv$config.prefix + window.__uv$config.encodeUrl(url), () => handleIFrameLoad(currentIndex))
    .render()

  const currentIndex = iframes.length
  iframeContainer.add(iframe)
  iframes.push({ iframe, button, id })

  focusIframe(currentIndex)
  getActiveTab().contentWindow?.addEventListener('keydown', handleKeybind)
}

const focusIframe = (index: number): void => {
  if (index === -1) {
    input.val('')
  }
  if (activeTabIndex !== -1) {
    iframes[activeTabIndex].iframe.styleJs({ display: 'none' })
    iframes[activeTabIndex].button.classOff('active')
  }
  iframes[index].iframe.styleJs({ display: 'block' })
  iframes[index].button.classOn('active')
  activeTabIndex = index
  input.val(
    window.__uv$config.decodeUrl(
      iframes[index].iframe.elm
        .getAttribute('src')
        ?.split(window.__uv$config.prefix)[1] ?? ''
    )
  )
}

const getActiveTab = (): HTMLIFrameElement => iframes[activeTabIndex].iframe.elm as HTMLIFrameElement

await registerServiceWorker()

const topbar = new HTML('div').class('topbar').appendTo(body)
const container = new HTML('div').class('container').appendTo(body)

const multiButton = new MultiButtonContainer()
  .add(new MultiButton('arrow_back', () => getIFrameWindow(getActiveTab()).history.back()).render())
  .add(new MultiButton('arrow_forward', () => getIFrameWindow(getActiveTab()).history.forward()).render())
  .add(new MultiButton('refresh', () => getIFrameWindow(getActiveTab()).location.reload()).render())

multiButton.render().appendTo(topbar)

const input = new InputBar('Search or type URL', (value: string) => {
  if (activeTabIndex === -1) {
    createNewTab(value)
  } else {
    getIFrameWindow(getActiveTab()).location.href = search(value, 'https://google.com/search?q=%s')
  }
})

input.render().appendTo(topbar)

const tabsContainer = new TabContainer()
const sidebar = new SideBar()
  .add(new SideBarButton(() => createNewTab(), undefined, Icon('add')).render())
  .add(tabsContainer.render())
  .add(new SideBarButton(() => {}, undefined, Icon('settings')).render())

const iframeContainer = new IFrameContainer()

sidebar.render().appendTo(container)
iframeContainer.render().appendTo(container)
