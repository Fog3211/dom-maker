
declare module 'dom-maker' {
  interface ElementPro<E extends HTMLElement = HTMLElement> {
    getElm: () => E
    addClass: (cls: string | string[]) => ElementPro
    removeClass: (cls: string | string[]) => ElementPro
    hasClass: (cls: string) => boolean
    toggleClass: (cls: string) => ElementPro
    addAttr: <T>(key: string, value: T) => ElementPro
    // addAttr: <T>({ key: string, value: T }[]) => ElementPro

  }
}

export class ElementPro<E extends HTMLElement = HTMLElement>  {
  /**
   * current element
   */
  private element: E = null
  /**
   * cache events to help manage and enable removing them easily
   */
  private eventsRegistry: Map<string, EventListenerOrEventListenerObject> = new Map()

  constructor(tagName: string = 'div') {
    this.element = document.createElement(tagName) as E
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
   * check current element is ElementPro
   *
   * @param {(HTMLElement|ElementPro)} element
   * @returns {boolean}
   */
  isElmPro(element: HTMLElement | ElementPro): element is ElementPro {
    return element instanceof ElementPro
  }

  /**
   * add multiple classes to element
   *
   * @param {(string|string[])} cls
   * @returns {ElementPro}
   */
  addClass(cls: string | string[]): this {
    if (Array.isArray(cls)) {
      cls.forEach((c) => this.element.classList.add(c.trim()));
    } else if (typeof cls !== 'undefined' && cls.trim().length > 0) {
      cls.split(' ').forEach((c) => this.element.classList.add(c.trim()));
    }
    return this
  }

  /**
   * remove multiple classes from element
   *
   * @param {string|string[]} cls
   * @returns {ElementPro}
   */
  removeClass(cls: string | string[]): this {
    if (Array.isArray(cls)) {
      cls.forEach((c) => this.element.classList.remove(c.trim()));
    } else if (typeof cls !== 'undefined' && cls.trim().length > 0) {
      cls.split(' ').forEach((c) => this.element.classList.remove(c.trim()));
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
   * @returns {ElementPro}
   */
  toggleClass(cls: string): this {
    return this.hasClass(cls) ? this.removeClass(cls) : this.addClass(cls);
  }

  /**
   * add an attribute to element
   *
   * @param {string} key
   * @param {number | string | boolean} value
   * @returns {ElementPro}
   */
  addAttr<T extends (number | string | boolean)>(key: string, value: T): ElementPro {
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
   * @returns {ElementPro}
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
   * @param {(HTMLElement|ElementPro)[]} elements
   * @returns {ElementPro}
   */
  addChildren(elements: (HTMLElement | ElementPro)[]): this {
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
   * @returns {ElementPro}
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
   * @returns {ElementPro}
   */
  unbind(type?: string | string[]): this {
    if (type === undefined) {
      for (const [event, listener] of this.eventsRegistry.entries()) {
        this.element.removeEventListener(event, listener)
      }
      this.eventsRegistry.clear()
    } else if (Array.isArray(type)) {
      type.forEach(t => {
        this.element.removeEventListener(t, this.eventsRegistry.get(t))
        this.eventsRegistry.delete(t)
      })
    } else {
      this.element.removeEventListener(type, this.eventsRegistry.get(type))
      this.eventsRegistry.delete(type)
    }
    return this
  }

  /**
   * create custom event on current element
   *
   * @param {(string} type
   * @param {Record<string,any>} detail
   * @param {Omit<CustomEventInit,'detail'>} options
   * @returns {ElementPro}
   */
  dispatch(type: string, detail?: CustomEventInit, options?: Omit<CustomEventInit, 'detail'>): this {
    this.element.dispatchEvent(new CustomEvent(type, Object.assign({}, { detail }, options || {})));
    return this
  }
}

export const Div = () => new ElementPro<HTMLDivElement>('div')
export const Span = () => new ElementPro<HTMLSpanElement>('span')
export const Img = () => new ElementPro<HTMLImageElement>('img')
export const Video = () => new ElementPro<HTMLVideoElement>('video')
export const Input = () => new ElementPro<HTMLInputElement>('input')
