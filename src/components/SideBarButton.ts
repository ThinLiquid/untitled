import HTML from '@datkat21/html'

export default class SideBarButton {
  private readonly element: HTML

  constructor (onClick: (e: any) => any, onContextMenu: (e: any) => any = () => {}, ...content: HTML[]) {
    this.element = new HTML('button')
      .class('side')
      .appendMany(...content)
      .on('click', onClick)
      .on('contextmenu', onContextMenu)
  }

  render (): HTML {
    return this.element
  }
}
