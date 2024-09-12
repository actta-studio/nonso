import Component from "../classes/Component";

import GSAP from "gsap";
import CustomEase from "gsap/CustomEase";
import ScrollTrigger from "gsap/ScrollTrigger";

GSAP.registerPlugin(CustomEase, ScrollTrigger);

export default class Animation extends Component {
  constructor({ element, elements, threshold }) {
    super({ element, elements });

    this.threshold = threshold || 0.2;
    this.createObserver();
  }

  createObserver() {
    this.observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateIn();
            this.observer.unobserve(this.element);
          }
        });
      },
      {
        // default threshold
        threshold: this.threshold,
      }
    );

    const rect = this.element.getBoundingClientRect();
    if (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    ) {
      // If the element is in view, run the animation
      GSAP.to(this.element, {
        autoAlpha: 1,
      });
    } else {
      // If the element is not in view, start observing
      this.observer.observe(this.element);
    }
  }

  animateIn() {
    throw new Error("animateIn method needs to be implemented");
  }

  animateOut() {
    throw new Error("animateOut method needs to be implemented");
  }
}
