import { each } from "lodash";
import gsap from "gsap";

export default class Page {
  constructor({ id, element, elements }) {
    this.id = id || "unnamed page";
    this.selector = element;
    this.selectorChildren = {
      ...elements,
    };

    this.addEventListeners = this.addEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
  }

  create() {
    console.log(`${this.id} page - called create!`);

    this.element = document.querySelector(this.selector);
    this.elements = new Map();

    each(this.selectorChildren, (selector, key) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList
      ) {
        this.elements.set(key, selector);
      } else if (Array.isArray(selector)) {
        this.elements.set(key, selector);
      } else {
        this.elements.set(key, document.querySelectorAll(selector));

        if (this.elements.get(key).length === 0) {
          this.elements.set(key, null);
        } else if (this.elements.get(key).length === 1) {
          this.elements.set(key, document.querySelector(selector));
        }
      }
    });
  }

  show() {
    return new Promise((resolve) => {
      this.animateIn = gsap.timeline();
      this.animateIn.to(this.element, {
        autoAlpha: 1,
      });
      this.animateIn.call(() => {
        console.log(`${this.id} page - called show!`);
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline();
      this.animateOut.to(this.element, {
        autoAlpha: 0,
      });
      this.animateOut.call(() => {
        console.log(`${this.id} page - called hide!`);

        // this.destroy();
        resolve();
      });
    });
  }

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    console.log(`${this.id} page has been destroyed!`);
    this.removeEventListeners();
  }
}
