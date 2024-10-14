import { map } from "lodash";

import Page from "../../classes/Page";

export default class Blog extends Page {
  constructor({ lenis }) {
    super({
      id: "blog",
      element: ".page--blog",
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
