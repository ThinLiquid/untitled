/* eslint-disable no-new */

import 'material-symbols'
import './style.scss'

import HTML from './html'
import {
  loadScript,
  registerServiceWorker
} from './utils'

import Toolbar, { ToolbarIcon, ToolbarIconGroup, ToolbarInvisibleDivider, ToolbarInput, ToolbarSpacer } from './components/Toolbar'
import { TabIcon, TabImage, TabImageIcon, TabLabel } from './components/Tab'
import NewTab from './pages/NewTab'
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
    searchEngine: string
  }
}

const body = new HTML(document.body)
const scripts = ['/baremux/bare.cjs', '/epoxy/index.js', '/uv/uv.bundle.js', '/uv/uv.config.js']

const ctrlKeybinds: {
  [key: string]: () => void
} = {
  s: () => {
    sidenav.class('hide')
  },
  t: () => {
    new Tab('untitled://newtab')
  }
}

window.searchEngine = 'https://google.com/search?q=%s'

const handleKeybind = (e: KeyboardEvent): void => {
  if (e.key in ctrlKeybinds && e.ctrlKey) {
    e.preventDefault()
    ctrlKeybinds[e.key]()
  }
}

for (const script of scripts) {
  await loadScript(script)
}

await registerServiceWorker()

body.styleJs({
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(90deg, #2A2C46, #6A445D)'
})

/* TOOLBAR */

const toggleToolbarButton = ToolbarIcon('view_sidebar', 'Toggle Sidebar (Ctrl+S)')
  .on('click', () => sidenav.class('hide'))

const navigationButtons = ToolbarIconGroup(
  ToolbarIcon('arrow_back', 'Click to go back'),
  ToolbarIcon('arrow_forward', 'Click to go forward')
)

const refreshButton = ToolbarIcon('refresh', 'Reload (Ctrl+R)')

const addTabButton = ToolbarIcon('add', 'Add')
const extrasGroup = ToolbarIconGroup(
  addTabButton
)

const inputbar = ToolbarInput()

const toolbar = Toolbar()
  .appendMany(
    toggleToolbarButton,
    ToolbarInvisibleDivider(),
    navigationButtons,
    refreshButton,
    inputbar,
    ToolbarSpacer(),
    extrasGroup
  )

/* CONTAINER */

const iframeContainer = new HTML('div')
  .styleJs({
    flex: '1',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1), 0 1px 1px 0 rgba(0,0,0,0.6)',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.025)',
    position: 'relative',
    zIndex: '2',
    overflow: 'hidden'
  })

const newTabButton = new HTML('button')
  .class('tab')
  .class('new')
  .styleJs({
    width: '225px',
    height: '40px',
    display: 'flex',
    padding: '7px 10px',
    alignItems: 'center',
    gap: '10px',
    borderRadius: '12px',
    background: 'transparent',
    border: 'none'
  })
  .appendMany(
    TabImageIcon('add'),
    TabLabel('New Tab'),
    TabLabel('Ctrl+T')
      .style({ flex: 'unset' })
  )

const sidenav = new HTML('div')
  .class('sidenav')
  .class('hide')
  .styleJs({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginRight: '8px'
  })
  .append(newTabButton)

const container = new HTML('div')
  .styleJs({
    display: 'flex',
    flex: '1',
    padding: '8px',
    paddingTop: '0'
  })
  .appendMany(
    sidenav,
    iframeContainer
  )

body.appendMany(
  toolbar,
  container
)

/* Even Handlers */

const tabs: Tab[] = []

class IFrame {
  element: HTML

  constructor () {
    this.element = new HTML('iframe')
      .styleJs({
        background: 'white',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        border: 'none',
        height: '100%',
        width: '100%',
        display: 'none'
      })
  }

  getSource (): string | null {
    return this.element.elm.getAttribute('src')
  }

  setSource (url: string): this {
    this.element.attr({ src: url })
    return this
  }

  getWindow (): Window {
    return (this.element.elm as HTMLIFrameElement).contentWindow as Window
  }

  getDocument (): Document {
    return (this.element.elm as HTMLIFrameElement).contentDocument as Document
  }

  on (event: string, callback: () => any): this {
    this.element.on(event, callback)
    return this
  }

  style (styles: Partial<CSSStyleDeclaration>): this {
    this.element.styleJs(styles as any)
    return this
  }

  appendTo (elm: HTML): this {
    this.element.appendTo(elm)
    return this
  }
}
class Tab {
  id = window.crypto.randomUUID()

  sidenavLabel: HTML
  sidenavCloseButton: HTML
  sidenavImageContainer: HTML
  sidenavButton: HTML

  iframe: IFrame

  untitledDomain: string

  constructor (url: string) {
    tabs.push(this)

    this.untitledDomain = url.split('://')[0] === 'untitled' ? url.split('://')[1] : ''

    this.sidenavLabel = TabLabel('New Tab')
    this.sidenavCloseButton = TabIcon('close')
    this.sidenavImageContainer = new HTML('div')
      .append(
        TabImageIcon('globe')
      )
      .styleJs({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      })

    this.sidenavButton = new HTML('button')
      .class('tab')
      .styleJs({
        width: '225px',
        height: '40px',
        display: 'flex',
        padding: '7px 10px',
        alignItems: 'center',
        gap: '10px',
        borderRadius: '12px',
        background: 'transparent',
        border: 'none'
      })
      .appendMany(
        this.sidenavImageContainer,
        this.sidenavLabel,
        this.sidenavCloseButton
      )

    this.iframe = new IFrame()
      .setSource(this.handleUrlChange(url))

    this.iframe.appendTo(iframeContainer)
    this.sidenavButton.appendTo(sidenav)

    this.focus()

    this.sidenavButton.on('click', () => this.focus())
    if (navigator.userAgent.includes('Chrome') && this.untitledDomain !== '') {
      this.handleIframeLoad().catch(console.error)
    }
    this.iframe.on('load', this.handleIframeLoad.bind(this))
  }

  pages = {
    newtab: {
      icon: 'search',
      title: 'New Tab',
      page: NewTab
    },
    blank: {
      icon: 'globe',
      title: 'Untitled',
      page: () => {}
    }
  }

  private async handleIframeLoad (): Promise<void> {
    this.iframe.getWindow().addEventListener('keydown', handleKeybind)
    this.untitledDomain = this.iframe.getWindow().location.href.startsWith('about:blank') ? this.untitledDomain : ''
    const { title } = this.iframe.getDocument()
    if (this.untitledDomain === '') {
      this.setTitle(title === '' ? 'Untitled' : title)
    } else {
      this.setTitle(this.pages[this.untitledDomain as keyof typeof this.pages]?.title ?? this.untitledDomain.split('.')[0])
    }

    const { location } = this.iframe.getWindow()
    const url = this.getRawUrl(window.__uv$config.decodeUrl(location.href.split(window.__uv$config.prefix)[1]) ?? location.href)
    console.log(url)

    if (url.startsWith('https')) {
      inputbar.qs('i')?.text('lock')
    } else if (url.startsWith('http')) {
      inputbar.qs('i')?.text('lock_open')
    } else if (url.startsWith('untitled')) {
      inputbar.qs('i')?.text('insert_drive_file')
    }
    inputbar.qs('input')?.val(this.untitledDomain === '' ? new URL(url).hostname : new URL(url).href)

    if (this.untitledDomain !== '') {
      this.sidenavImageContainer.clear()
        .append(
          TabImageIcon(this.pages[this.untitledDomain as keyof typeof this.pages]?.icon ?? 'globe')
        )
    } else {
      const icon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`
      if (icon != null) {
        this.sidenavImageContainer.clear()
          .append(
            TabImage(icon)
          )
      }
    }

    if (this.untitledDomain !== '') {
      await this.loadPage()
    }
  }

  private async loadPage (): Promise<void> {
    await this.pages[this.untitledDomain as keyof typeof this.pages ?? 'blank'].page(this.iframe.getDocument().body)
  }

  private getRawUrl (url: string): string {
    const isProxied = url.split(window.__uv$config.prefix)[1] != null

    return isProxied ? window.__uv$config.decodeUrl(url.split(window.__uv$config.prefix)[1]) : url.startsWith('about:blank') ? `untitled://${this.untitledDomain}` : url
  }

  unfocus (): void {
    this.iframe.style({ display: 'none' })
    this.sidenavButton.classOff('active')
  }

  focus (): void {
    for (const tab of tabs) {
      tab.unfocus()
    }
    this.iframe.style({ display: 'block' })
    this.sidenavButton.classOn('active')
  }

  setTitle (title: string): void {
    this.sidenavLabel.text(title)
  }

  private handleUrlChange (url: string): string {
    if (url.startsWith('untitled://')) {
      return 'about:blank'
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      return window.__uv$config.prefix + window.__uv$config.encodeUrl(url)
    } else if (url === '') {
      return window.__uv$config.prefix + window.__uv$config.encodeUrl(`https://${url}`)
    } else {
      return url
    }
  }
}

window.addEventListener('keydown', handleKeybind)
newTabButton.on('click', () => { new Tab('untitled://newtab') })
addTabButton.on('click', () => { new Tab('untitled://newtab') })

new Tab('untitled://newtab')
