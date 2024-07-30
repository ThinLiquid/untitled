import IFrame from '../components/IFrame'
import { TabLabel, TabIcon, TabImageIcon, TabImage } from '../components/Tab'
import HTML from '../html'
import Keybinds from '../pages/Keybinds'
import Theme from '../pages/Theme'
import Welcome from '../pages/Welcome'

export default class Tab {
  id = window.crypto.randomUUID()

  sidenavLabel: HTML
  sidenavCloseButton: HTML
  sidenavImageContainer: HTML
  sidenavButton: HTML

  iframe: IFrame

  untitledDomain: string

  constructor (url: string) {
    window.tabs.push(this)

    this.untitledDomain = url.split('://')[0] === 'untitled' ? url.split('://')[1] : ''

    this.sidenavLabel = TabLabel('New Tab')
    this.sidenavCloseButton = TabIcon('close')
      .on('click', (e) => {
        e.stopPropagation()
        this.close()
      })
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
      .setSource(url)

    this.iframe.appendTo(window.iframeContainer)
    this.sidenavButton.appendTo(window.sidenav)

    this.focus()

    this.sidenavButton.on('click', () => this.focus())
    if (navigator.userAgent.includes('Chrome') && this.untitledDomain !== '') {
      this.handleIframeLoad().catch(console.error)
    }
    this.iframe.on('load', this.handleIframeLoad.bind(this))
  }

  pages = {
    welcome: {
      icon: 'search',
      title: 'Welcome',
      page: Welcome
    },
    shortcuts: {
      icon: 'keyboard',
      title: 'Shortcuts',
      page: Keybinds
    },
    theme: {
      icon: 'palette',
      title: 'Theme',
      page: Theme
    },
    blank: {
      icon: 'globe',
      title: 'Untitled',
      page: () => {}
    }
  }

  close (): void {
    const index = window.tabs.findIndex((tab) => tab.id === this.id)
    window.tabs.splice(index, 1)
    this.iframe.element.elm.remove()
    this.sidenavButton.elm.remove()
    if (window.currentTab.id === this.id) {
      window.currentTab = window.tabs[index - 1] ?? window.tabs[0]
    }
    window.currentTab.focus()
  }

  private async handleIframeLoad (): Promise<void> {
    this.iframe.getWindow().addEventListener('keydown', window.handleKeybind)
    this.untitledDomain = this.iframe.element.elm.getAttribute('data-domain') ?? ''
    const { title } = this.iframe.getDocument()
    if (this.untitledDomain === '') {
      this.setTitle(title === '' ? 'Untitled' : title)
    } else {
      this.setTitle(this.pages[this.untitledDomain as keyof typeof this.pages]?.title ?? this.untitledDomain.split('.')[0])
    }

    const { location } = this.iframe.getWindow()
    const url = this.getRawUrl(window.__uv$config.decodeUrl(location.href.split(window.__uv$config.prefix)[1]) ?? location.href)

    if (url.startsWith('https')) {
      window.inputbar.qs('i')?.text('lock')
    } else if (url.startsWith('http')) {
      window.inputbar.qs('i')?.text('lock_open')
    } else if (url.startsWith('untitled')) {
      window.inputbar.qs('i')?.text('insert_drive_file')
    }
    window.inputbar.qs('input')?.val(this.untitledDomain === '' ? new URL(url).hostname : new URL(url).href)

    if (this.untitledDomain === '') {
      const icon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`
      if (icon != null) {
        this.sidenavImageContainer.clear()
          .append(
            TabImage(icon)
          )
      }
    } else {
      this.sidenavImageContainer.clear()
        .append(
          TabImageIcon(this.pages[this.untitledDomain as keyof typeof this.pages]?.icon ?? 'globe')
        )
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
    for (const tab of window.tabs) {
      if (tab.id === this.id) continue
      tab.unfocus()
    }
    this.iframe.style({ display: 'block' })
    this.sidenavButton.classOn('active')
    window.currentTab = this
  }

  setTitle (title: string): void {
    this.sidenavLabel.text(title)
  }

  static handleUrlChange (url: string): string {
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
