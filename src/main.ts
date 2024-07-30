/* eslint-disable no-new */

import 'material-symbols'
import './style.scss'

import HTML from './html'
import {
  loadScript,
  registerServiceWorker
} from './utils'

import Toolbar, { ToolbarIcon, ToolbarIconGroup, ToolbarInvisibleDivider, ToolbarInput, ToolbarSpacer } from './components/Toolbar'
import { TabImageIcon, TabLabel } from './components/Tab'
import Tab from './others/Tab'
import OmniTool from './components/OmniTool'
import { setColor } from './pages/Theme'
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
    tabs: Tab[]
    currentTab: Tab

    sidenav: HTML
    inputbar: HTML
    iframeContainer: HTML

    handleKeybind: (e: KeyboardEvent) => void
  }
}

const body = new HTML(document.body)
const scripts = ['/baremux/bare.cjs', '/epoxy/index.js', '/uv/uv.bundle.js', '/uv/uv.config.js']

const ctrlKeybinds: {
  [key: string]: () => void
} = {
  s: () => {
    window.sidenav.class('hide')
  },
  r: () => {
    window.currentTab.iframe.getWindow().location.reload()
  }
}

setColor(window.localStorage.getItem('theme') ?? '#aabbaa')

const altKeybinds: {
  [key: string]: () => void
} = {
  ArrowUp: () => {
    const previousTab = window.tabs[window.tabs.indexOf(window.currentTab) - 1]
    if (previousTab != null) {
      window.currentTab = previousTab
      window.currentTab.focus()
    }
  },
  ArrowDown: () => {
    const nextTab = window.tabs[window.tabs.indexOf(window.currentTab) + 1]
    if (nextTab != null) {
      window.currentTab = nextTab
      window.currentTab.focus()
    }
  },
  ArrowLeft: () => {
    window.currentTab.iframe.getWindow().history.back()
  },
  ArrowRight: () => {
    window.currentTab.iframe.getWindow().history.forward()
  },
  t: () => {
    new OmniTool('newtab')
  }
}

window.searchEngine = 'https://google.com/search?q=%s'

window.handleKeybind = (e: KeyboardEvent): void => {
  if (e.key in ctrlKeybinds && e.ctrlKey) {
    e.preventDefault()
    ctrlKeybinds[e.key]()
  } else if (e.key in altKeybinds && e.altKey) {
    e.preventDefault()
    altKeybinds[e.key]()
  }
}

for (const script of scripts) {
  await loadScript(script)
}

await registerServiceWorker()

body.styleJs({
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(90deg, var(--theme), var(--theme2))'
})

/* TOOLBAR */

const toggleToolbarButton = ToolbarIcon('view_sidebar', 'Toggle Sidebar (Ctrl+S)')
  .on('click', () => window.sidenav.class('hide'))

const navigationButtons = ToolbarIconGroup(
  ToolbarIcon('arrow_back', 'Go back (Alt+ArrowLeft)')
    .on('click', () => {
      window.currentTab.iframe.getWindow().history.back()
    }),
  ToolbarIcon('arrow_forward', 'Go forward (Alt+ArrowRight)')
    .on('click', () => {
      window.currentTab.iframe.getWindow().history.forward()
    })
)

const refreshButton = ToolbarIcon('refresh', 'Reload (Ctrl+R)')
  .on('click', () => {
    window.currentTab.iframe.getWindow().location.reload()
  })

const addTabButton = ToolbarIcon('add', 'New Tab (Alt+T)')
const extrasGroup = ToolbarIconGroup(
  addTabButton
)

window.inputbar = ToolbarInput()

const toolbar = Toolbar()
  .appendMany(
    toggleToolbarButton,
    ToolbarInvisibleDivider(),
    navigationButtons,
    refreshButton,
    window.inputbar,
    ToolbarSpacer(),
    extrasGroup
  )

/* CONTAINER */

window.iframeContainer = new HTML('div')
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
    TabLabel('Alt+T')
      .style({ flex: 'unset' })
  )

window.sidenav = new HTML('div')
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
    window.sidenav,
    window.iframeContainer
  )

body.appendMany(
  toolbar,
  container
)

/* Even Handlers */

window.tabs = []
window.currentTab = new Tab('untitled://welcome')

window.addEventListener('keydown', window.handleKeybind)
newTabButton.on('click', () => { new OmniTool('newtab') })
addTabButton.on('click', () => { new OmniTool('newtab') })

const firstRun = localStorage.getItem('firstRun') ?? 'true'

const blurOverlay = new HTML('div')
  .styleJs({
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backdropFilter: 'blur(20px)',
    width: '100vw',
    height: '100vh',
    zIndex: '199',
    transition: 'opacity 1s'
  })

const firstRunBackground = new HTML('div')
  .styleJs({
    position: 'absolute',
    top: '50%',
    left: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: 'Inter, sans-serif',
    zIndex: '200',
    backgroundColor: 'hsla(276,44%,49%,1)',
    backgroundImage: `radial-gradient(at 97% 63%, hsla(278,100%,77%,1) 0px, transparent 50%),
radial-gradient(at 74% 31%, hsla(184,100%,78%,1) 0px, transparent 50%),
radial-gradient(at 96% 59%, hsla(285,100%,88%,1) 0px, transparent 50%),
radial-gradient(at 94% 6%, hsla(250,69%,76%,1) 0px, transparent 50%),
radial-gradient(at 84% 67%, hsla(266,100%,76%,1) 0px, transparent 50%),
radial-gradient(at 85% 91%, hsla(242,100%,50%,1) 0px, transparent 50%),
radial-gradient(at 13% 95%, hsla(183,90%,63%,0.49) 0px, transparent 50%),
radial-gradient(at 60% 55%, hsla(236,100%,50%,1) 0px, transparent 50%),
radial-gradient(at 46% 8%, hsla(240,100%,50%,1) 0px, transparent 50%),
radial-gradient(at 13% 64%, hsla(265,0%,100%,1) 0px, transparent 50%)`,
    animation: 'rotate 10s infinite linear',
    width: '100vw',
    height: '100vw',
    opacity: '0.4',
    transition: 'opacity 1s'
  })

const firstRunContent = new HTML('div')
  .styleJs({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4vw',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontFamily: 'Inter, sans-serif',
    zIndex: '201',
    transition: 'opacity 1s'
  })
  .appendMany(
    new HTML('h1')
      .html('Meet the internet again.')
      .styleJs({
        fontSize: '5vw',
        textAlign: 'center',
        width: '40vw',
        minWidth: 'calc(100% - 20px)',
        lineHeight: '1',
        fontWeight: '800',
        margin: '0'
      }),
    new HTML('button')
      .class('material-symbols-rounded')
      .text('arrow_forward')
      .styleJs({
        background: 'rgba(0,0,125,0.35)',
        border: 'none',
        color: 'white',
        backdropFilter: 'blur(20px)',
        padding: '0.75vw 1.5vw',
        borderRadius: '0.75vw',
        fontSize: '2vw',
        cursor: 'pointer'
      })
      .on('click', () => {
        localStorage.setItem('firstRun', 'false')
        blurOverlay.style({ opacity: '0' })
        firstRunBackground.style({ opacity: '0' })
        firstRunContent.style({ opacity: '0' })
        setTimeout(() => {
          blurOverlay.cleanup()
          firstRunBackground.cleanup()
          firstRunContent.cleanup()
        }, 1000)
      })
  )

if (firstRun === 'true') {
  body.appendMany(
    blurOverlay,
    firstRunBackground,
    firstRunContent
  )
}
