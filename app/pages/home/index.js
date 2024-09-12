import { map } from "lodash";

import Page from "../../classes/Page";

export default class Home extends Page {
  constructor({ lenis }) {
    super({
      id: "home",
      element: ".page--home",
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
