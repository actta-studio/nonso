import each from "lodash/each";
import gsap from "gsap";

import Component from "../classes/Component";

export default class Preloader extends Component {
  constructor() {
    super({
      id: "preloader",
      element: ".preloader",
      elements: {
        progress: ".preloader__progress",
        images: document.querySelectorAll("img"),
      },
    });

    this.length = 0;

    this.createLoader();
  }

  createLoader() {
    const progressElement = this.elements.get("progress");

    if (this.elements.get("images").length === 0) {
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += 1;
        progressElement.innerHTML = `${progress}%`;

        if (progress === 100) {
          clearInterval(intervalId);
          this.onLoaded();
        }
      }, 20);
    } else {
      each(
        this.elements.get("images"),
        (element) => {
          setTimeout(() => {
            element.onload = (_) => this.onAssetLoaded(element);
            element.src = element.getAttribute("data-src");
            element.classList.add("loaded");
          });
        },
        2000
      );
    }
  }

  onAssetLoaded(image) {
    this.length += 1;
    const percent = this.length / (this.elements.get("images").length ?? 1);

    const clampedPercent = Math.max(0, Math.min(percent * 100, 100));

    this.elements.get("progress").innerHTML = Math.round(clampedPercent) + "%";

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline({});

      this.animateOut.to(this.elements.get("progress"), {
        autoAlpha: 0,
        delay: 0.5,
      });

      this.animateOut.call((_) => {
        this.emit("completed");
        resolve();
      });
    });
  }

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    super.destroy();
    this.element.parentNode.removeChild(this.element);
  }
}
