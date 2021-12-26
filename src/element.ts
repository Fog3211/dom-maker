
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

export class ElementPro<E extends HTMLElement = HTMLElement> extends Element {
  /**
   * current element
   */
  private element: E = null

  constructor(tagName: string = 'div') {
    super()
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
   * add multiple classes to element
   *
   * @param {(string|string[])} cls
   * @returns {ElementPro}
   */
  addClass(cls: string | string[]): this {
    if (Array.isArray(cls)) {
      cls.forEach((c) => this.classList.add(c.trim()));
    } else if (typeof cls !== 'undefined' && cls.trim().length > 0) {
      cls.split(' ').forEach((c) => this.classList.add(c.trim()));
    }
    return this
  }

  /**
   * remove multiple classes from element
   *
   * @param  {string|string[]} cls
   * @returns {ElementPro}
   */
  removeClass(cls: string | string[]): this {
    if (Array.isArray(cls)) {
      cls.forEach((c) => this.classList.remove(c.trim()));
    } else if (typeof cls !== 'undefined' && cls.trim().length > 0) {
      cls.split(' ').forEach((c) => this.classList.remove(c.trim()));
    }
    return this
  }

  /**
   * check if element has a certain class
   *
   * @param  {string} cls
   * @returns {boolean}
   */
  hasClass(cls: string): boolean {
    return this.classList.contains(cls)
  }

  /**
   * toggle element classes
   *
   * @param  {string} cls
   * @returns {ElementPro}
   */
  toggleClass(cls: string): this {
    return this.hasClass(cls) ? this.removeClass(cls) : this.addClass(cls);
  }

  /**
   * add an attribute to element
   *
   * @param  {string} key
   * @param  {number | string | boolean} value
   * @returns {ElementPro}
   */
  addAttr<T extends (number | string | boolean)>(key: string, value: T): ElementPro {
    if (typeof value.toString === 'function') {
      this.setAttribute(key, value.toString())
    } else {
      this.setAttribute(key, '')
    }
    return this
  }

  /**
   * remove multiple attributes from element
   *
   * @param  {string|string[]} key
   * @returns {ElementPro}
   */
  removeAttr(key: string | string[]): this {
    if (Array.isArray(key)) {
      key.forEach(k => this.removeAttribute(k))
    } else {
      this.removeAttribute(key)
    }
    return this
  }
}

export const Div = () => new ElementPro<HTMLDivElement>('div')
export const Span = () => new ElementPro<HTMLSpanElement>('span')
export const Img = () => new ElementPro<HTMLImageElement>('img')
export const Video = () => new ElementPro<HTMLVideoElement>('video')
export const Input = () => new ElementPro<HTMLInputElement>('input')
