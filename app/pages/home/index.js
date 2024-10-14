import gsap from "gsap";
import Page from "../../classes/Page";

export default class Home extends Page {
  constructor({ lenis }) {
    super({
      id: "home",
      element: ".page--home",
      elements: {
        popup: "[data-toggle='popup']",
        clock: ".header__top .clock",
      },
    });

    this.lenis = lenis;
  }

  show() {
    super.show();
    this.lenis.start();
  }

  create({ sourcePreloader }) {
    this.sourcePreloader = sourcePreloader;

    super.create();
    this.addEventListeners();
  }

  createAnimations() {}

  showPopup() {
    gsap.to(this.elements.get("clock"), {
      duration: 0.3,
      yPercent: 100,
      ease: "power2.out",
    });
  }

  hidePopup() {
    gsap.to(this.elements.get("clock"), {
      duration: 0.3,
      yPercent: -100,
      ease: "power2.out",
    });
  }

  addEventListeners() {
    // this.elements
    //   .get("popup")
    //   .addEventListener("mouseover", this.showPopup.bind(this));
    // this.elements
    //   .get("popup")
    //   .addEventListener("mouseout", this.hidePopup.bind(this));
  }

  removeEventListeners() {
    // this.elements
    //   .get("popup")
    //   .removeEventListener("mouseover", this.showPopup.bind(this));
    // this.elements
    //   .get("popup")
    //   .removeEventListener("mouseout", this.hidePopup.bind(this));
  }

  destroy() {
    super.destroy();
  }
}
