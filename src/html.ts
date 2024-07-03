/*!
HTML library by datkat21 on GitHub. Licensed under MIT
https://github.com/datkat21/html
! */
export default class HTML {
  /** The HTML element referenced in this instance. Change using `.swapRef()`, or remove using `.cleanup()`. */
  elm: HTMLInputElement | HTMLElement
  /**
   * Create a new instance of the HTML class.
   * @param elm The HTML element to be created or classified from.
   */
  constructor (elm: string | HTMLElement) {
    this.elm = typeof elm === 'string' ? document.createElement(elm ?? 'div') : elm
  }

  /**
   * Sets the text of the current element.
   * @param val The text to set to.
   * @returns HTML
   */
  text (val: string): HTML {
    this.elm.innerText = val
    return this
  }

  /**
   * Sets the text of the current element.
   * @param val The text to set to.
   * @returns HTML
   */
  html (val: string): HTML {
    this.elm.innerHTML = val
    return this
  }

  /**
   * Safely remove the element. Can be used in combination with a `.swapRef()` to achieve a "delete & swap" result.
   * @returns HTML
   */
  cleanup (): HTML {
    this.elm.remove()
    return this
  }

  /**
   * querySelector something.
   * @param selector The query selector.
   * @returns The HTML element (not as HTML)
   */
  query (selector: string): HTMLElement | null {
    return this.elm.querySelector(selector)
  }

  /**
   * An easier querySelector method.
   * @param query The string to query
   * @returns a new HTML
   */
  qs (query: string): HTML | null {
    return this.elm.querySelector(query) != null ? HTML.from(this.elm.querySelector(query) as HTMLElement) : null
  }

  /**
   * An easier querySelectorAll method.
   * @param query The string to query
   * @returns a new HTML
   */
  qsa (query: string): Array<HTML | null> | null {
    return this.elm.querySelector(query) != null
      ? Array.from(this.elm.querySelectorAll(query)).map((e) =>
        HTML.from(e as HTMLElement)
      )
      : null
  }

  /**
   * Sets the ID of the element.
   * @param val The ID to set.
   * @returns HTML
   */
  id (val: string): HTML {
    this.elm.id = val
    return this
  }

  /**
   * Toggle on/off a class.
   * @param val The class to toggle.
   * @returns HTML
   */
  class (...val: string[]): HTML {
    for (let i = 0; i < val.length; i++) this.elm.classList.toggle(val[i])
    return this
  }

  /**
   * Toggles ON a class.
   * @param val The class to enable.
   * @returns HTML
   */
  classOn (...val: string[]): HTML {
    for (let i = 0; i < val.length; i++) this.elm.classList.add(val[i])
    return this
  }

  /**
   * Toggles OFF a class.
   * @param val The class to disable.
   * @returns HTML
   */
  classOff (...val: string[]): HTML {
    for (let i = 0; i < val.length; i++) this.elm.classList.remove(val[i])
    return this
  }

  /**
   * Apply CSS styles (dashed method.) Keys use CSS syntax, e.g. `background-color`.
   * @param obj The styles to apply (as an object of `key: value;`.)
   * @returns HTML
   */
  style (obj: { [x: string]: string | null }): HTML {
    for (const key of Object.keys(obj)) { this.elm.style.setProperty(key, obj[key]) }
    return this
  }

  /**
   * Apply CSS styles (JS method.) Keys use JS syntax, e.g. `backgroundColor`.
   * @param obj The styles to apply (as an object of `key: value;`)
   * @returns HTML
   */
  styleJs (obj: { [key: string]: string | null }): HTML {
    // @ts-expect-error
    for (const key of Object.keys(obj)) this.elm.style[key] = obj[key]
    return this
  }

  /**
   * Apply an event listener.
   * @param ev The event listener type to add.
   * @param cb The event listener callback to add.
   * @returns HTML
   */
  on (ev: string, cb: (e: any) => any | EventListenerObject): HTML {
    this.elm.addEventListener(ev, cb)
    return this
  }

  /**
   * Remove an event listener.
   * @param ev The event listener type to remove.
   * @param cb The event listener callback to remove.
   * @returns HTML
   */
  un (ev: string, cb: (e: any) => any | EventListenerObject): HTML {
    this.elm.removeEventListener(ev, cb)
    return this
  }

  /**
   * Retrieve the corresponding HTMLElement.
   * @param element The element to retrieve. Can be an HTMLElement, HTML instance, or a string (as query selector).
   * @returns The corresponding HTMLElement or null if QS and element are not found.
   */
  getElement (element: HTMLElement | HTML | string): HTMLElement {
    const p = typeof element === 'string' ? document.querySelector(element) as Element : element instanceof HTML ? element.elm : element

    return p as HTMLElement
  }

  /**
   * Append this element to another element. Uses `appendChild()` on the parent.
   * @param parent Element to append to. HTMLElement, HTML, and string (as querySelector) are supported.
   * @returns HTML
   */
  appendTo (parent: HTMLElement | HTML | string): HTML {
    const p = this.getElement(parent)
    if (p instanceof HTMLElement) p.appendChild(this.elm)
    else throw new Error('Invalid parent element, exausted 3 checks.')
    return this
  }

  /**
   * Prepend this element to another element. Uses `prepend()` on the parent.
   * @param parent Element to append to. HTMLElement, HTML, and string (as querySelector) are supported.
   * @returns HTML
   */
  prependTo (parent: HTMLElement | HTML | string): HTML {
    const p = this.getElement(parent)
    if (p instanceof HTMLElement) p.prepend(this.elm)
    return this
  }

  /**
   * Append an element. Typically used as a `.append(new HTML(...))` call.
   * @param elem The element to append.
   * @returns HTML
   */
  append (elem: string | HTMLElement | HTML): HTML {
    const e = this.getElement(elem)
    if (e instanceof HTMLElement) this.elm.appendChild(e)
    else if (typeof elem === 'string') {
      const newElem = document.createElement(elem)
      this.elm.appendChild(newElem)
      return new HTML(newElem.tagName)
    }
    return this
  }

  /**
   * Prepend an element. Typically used as a `.prepend(new HTML(...))` call.
   * @param elem The element to prepend.
   * @returns HTML
   */
  prepend (elem: string | HTMLElement | HTML): HTML {
    const e = this.getElement(elem)
    if (e instanceof HTMLElement) this.elm.prepend(e)
    else if (typeof elem === 'string') {
      const newElem = document.createElement(elem)
      this.elm.prepend(newElem)
      return new HTML(newElem.tagName)
    }
    return this
  }

  /**
   * Append multiple elements. Typically used as a `.appendMany(new HTML(...), new HTML(...)` call.
   * @param elements The elements to append.
   * @returns HTML
   */
  appendMany (...elements: any[]): HTML {
    for (const elem of elements) this.append(elem)
    return this
  }

  /**
   * Prepend multiple elements. Typically used as a `.prependMany(new HTML(...), new HTML(...)` call.
   * @param elements The elements to prepend.
   * @returns HTML
   */
  prependMany (...elements: any[]): HTML {
    for (const elem of elements) this.prepend(elem)
    return this
  }

  /**
   * Clear the innerHTML of the element.
   * @returns HTML
   */
  clear (): HTML {
    this.elm.innerHTML = ''
    return this
  }

  /**
   * Set attributes (object method.)
   * @param obj The attributes to set (as an object of `key: value;`)
   * @returns HTML
   */
  attr (obj: { [x: string]: any }): HTML {
    for (const key in obj) {
      if (obj[key] != null) { this.elm.setAttribute(key, obj[key]) } else this.elm.removeAttribute(key)
    }
    return this
  }

  /**
   * Set the text value of the element. Only works if element is `input` or `textarea`.
   * @param str The value to set.
   * @returns HTML
   */
  val (str: any): HTML {
    (this.elm as HTMLInputElement).value = str
    return this
  }

  /**
   * Retrieve text content from the element. (as innerText, not trimmed)
   * @returns string
   */
  getText (): string {
    return (this.elm as HTMLInputElement).innerText
  }

  /**
   * Retrieve HTML content from the element.
   * @returns string
   */
  getHTML (): string {
    return (this.elm as HTMLInputElement).innerHTML
  }

  /**
   * Retrieve the value of the element. Only applicable if it is an `input` or `textarea`.
   * @returns string
   */
  getValue (): string {
    return (this.elm as HTMLInputElement).value
  }

  /**
   * Swap the local `elm` with a new HTMLElement.
   * @param elm The element to swap with.
   * @returns HTML
   */
  swapRef (elm: HTMLElement): HTML {
    this.elm = elm
    return this
  }

  /**
   * An alternative method to create an HTML instance.
   * @param elm Element to create from.
   * @returns HTML
   */
  static from (elm: HTMLElement | string): HTML | null {
    const qs = (): HTML | null => HTML.qs(elm as string)
    if (typeof elm === 'string') return qs()
    return new HTML(elm)
  }

  /**
   * An easier querySelector method.
   * @param query The string to query
   * @returns a new HTML
   */
  static qs (query: string): HTML | null {
    if (document.querySelector(query) != null) { return HTML.from(document.querySelector(query) as HTMLElement) }
    return null
  }

  /**
   * An easier querySelectorAll method.
   * @param query The string to query
   * @returns a new HTML
   */
  static qsa (query: string): Array<HTML | null> | null {
    if (document.querySelector(query) != null) {
      return Array.from(document.querySelectorAll(query)).map((e) =>
        HTML.from(e as HTMLElement)
      )
    }

    return null
  }
}
