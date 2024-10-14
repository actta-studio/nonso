import Page from "../../classes/Page";

export default class Work extends Page {
  constructor({ lenis }) {
    super({
      id: "work",
      element: ".page--work",
      elements: {},
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
    // this.createAnimations();
    this.addEventListeners();
  }

  createAnimations() {}

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    super.destroy();
  }
}
