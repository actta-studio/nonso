import each from "lodash/each";
import gsap from "gsap";

import Component from "../classes/Component";

export default class Preloader extends Component {
  constructor({ logo, template }) {
    super({
      id: "preloader",
      element: ".preloader",
      elements: {
        title: ".preloader__title",
      },
    });

    this.logo = logo;
    this.template = template;
    this.createLoader();

    this.addEventListeners();
  }

  createLoader() {
    this.onLoaded();
  }

  async onLoaded() {
    return new Promise(async (resolve) => {
      console.log("this.template - ", this.template);

      if (this.template === "404") {
        await this.logo.animate("not-found");
      } else {
        await this.logo.animate("intro");
      }

      this.animateOut = gsap.timeline({});

      this.animateOut.to(this.elements.get("title"), {
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
