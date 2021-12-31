const NS_MAP = {
  'HTML': 'http://www.w3.org/1999/xhtml',
  'SVG': 'http://www.w3.org/2000/svg',
  'XBL': 'http://www.mozilla.org/xbl',
  'XUL': 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
}
export class ElementPlus<E extends HTMLElement = HTMLElement>  {
  /**
   * current element
   */
  private element: E = null!
  /**
   * cache events to manage and remove them easily
   */
  private eventsRegistry: Map<string, EventListenerOrEventListenerObject> = new Map()

  constructor(
    tagName: (keyof HTMLElementTagNameMap | string & {}) = 'div',
    nameSpace?: keyof typeof NS_MAP
  ) {
    this.element = document.createElementNS(NS_MAP[nameSpace || 'HTML'], tagName) as E
  }

  /**
   * get current element
   *
   * @returns {HTMLElement}
   */
  getElm(): E {
    return this.element
  }

  /**
   * check current element is ElementPlus
   *
   * @param {(HTMLElement|ElementPlus)} element
   * @returns {boolean}
   */
  isElmPro(element: HTMLElement | ElementPlus): element is ElementPlus {
    return element instanceof ElementPlus
  }

  /**
   * add multiple classes to element
   *
   * @param {(string|string[])} cls
   * @returns {ElementPlus}
   */
  addClass(cls: string | string[]): this {
    if (Array.isArray(cls)) {
      cls.forEach((c) => this.element.classList.add(c.trim()))
    } else if (typeof cls !== 'undefined' && cls.trim().length > 0) {
      cls.split(' ').forEach((c) => this.element.classList.add(c.trim()))
    }
    return this
  }

  /**
   * remove multiple classes from element
   *
   * @param {string|string[]} cls
   * @returns {ElementPlus}
   */
  removeClass(cls: string | string[]): this {
    if (Array.isArray(cls)) {
      cls.forEach((c) => this.element.classList.remove(c.trim()))
    } else if (typeof cls !== 'undefined' && cls.trim().length > 0) {
      cls.split(' ').forEach((c) => this.element.classList.remove(c.trim()))
    }
    return this
  }

  /**
   * check if element has a certain class
   *
   * @param {string} cls
   * @returns {boolean}
   */
  hasClass(cls: string): boolean {
    return this.element.classList.contains(cls)
  }

  /**
   * toggle element classes
   *
   * @param {string} cls
   * @returns {ElementPlus}
   */
  toggleClass(cls: string): this {
    return this.hasClass(cls) ? this.removeClass(cls) : this.addClass(cls)
  }

  /**
   * add an attribute to element
   *
   * @param {string} key
   * @param {number | string | boolean} value
   * @returns {ElementPlus}
   */
  setAttr<T extends (number | string | boolean)>(key: string, value: T): ElementPlus {
    if (typeof value.toString === 'function') {
      this.element.setAttribute(key, value.toString())
    } else {
      this.element.setAttribute(key, '')
    }
    return this
  }

  /**
   * remove multiple attributes from element
   *
   * @param {string|string[]} key
   * @returns {ElementPlus}
   */
  removeAttr(key: string | string[]): this {
    if (Array.isArray(key)) {
      key.forEach(k => this.element.removeAttribute(k))
    } else {
      this.element.removeAttribute(key)
    }
    return this
  }

  /**
   * add multiple children to current element
   *
   * @param {(HTMLElement|ElementPlus)[]} elements
   * @returns {ElementPlus}
   */
  addChildren(elements: (HTMLElement | ElementPlus)[]): this {
    if (Array.isArray(elements)) {
      (elements).filter(Boolean).forEach(element => {
        if (this.isElmPro(element)) {
          this.element.appendChild(element.getElm())
        } else if (element instanceof HTMLElement) {
          this.element.appendChild(element)
        }
      })
    }
    return this
  }

  /**
   * add a event listener if here not exist and store listener to remove it easily
   *
   * @param {(string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} options
   * @returns {ElementPlus}
   */
  on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this {
    if (!this.eventsRegistry.has(type)) {
      this.element.addEventListener(type, listener, options)
      this.eventsRegistry.set(type, listener)
    }
    return this
  }

  /**
   * remove event listener from current element
   *
   * @param {(string|string[]|undefined} type
   * @returns {ElementPlus}
   */
  unbind(type?: string | string[]): this {
    if (type === undefined) {
      for (const [event, listener] of this.eventsRegistry.entries()) {
        this.element.removeEventListener(event, listener)
      }
      this.eventsRegistry.clear()
    } else if (Array.isArray(type)) {
      type.forEach(t => {
        const handler = this.eventsRegistry.get(t)
        if (handler) {
          this.element.removeEventListener(t, handler)
          this.eventsRegistry.delete(t)
        }
      })
    } else {
      const handler = this.eventsRegistry.get(type)
      if (handler) {
        this.element.removeEventListener(type, handler)
        this.eventsRegistry.delete(type)
      }
    }
    return this
  }

  /**
   * create custom event on current element
   *
   * @param {(string} type
   * @param {Record<string,any>} detail
   * @param {Omit<CustomEventInit,'detail'>} options
   * @returns {ElementPlus}
   */
  dispatch(type: string, detail?: CustomEventInit, options?: Omit<CustomEventInit, 'detail'>): this {
    this.element.dispatchEvent(new CustomEvent(type, Object.assign({}, { detail }, options || {})))
    return this
  }

  /**
   * set current element innerText
   *
   * @param {(string} text
   * @returns {ElementPlus}
   */
  setText(text: string): this {
    this.element.innerText = text
    return this
  }

  /**
   * set current element innerHtml
   *
   * @param {(string} html
   * @returns {ElementPlus}
   */
  setHtml(html: string): this {
    this.element.innerHTML = html
    return this
  }

  /**
   * append current element to target element
   */
  appendTo(selectors: string) {
    const target = document.querySelector(selectors) || document.body
    target.appendChild(this.element)
  }
}


export const Div = () => new ElementPlus<HTMLDivElement>('div')
export const Span = () => new ElementPlus<HTMLSpanElement>('span')
export const Img = () => new ElementPlus<HTMLImageElement>('img')
export const Video = () => new ElementPlus<HTMLVideoElement>('video')
export const Input = () => new ElementPlus<HTMLInputElement>('input')
export const Button = () => new ElementPlus<HTMLButtonElement>('button')
