import { map } from "lodash";

import Page from "../../classes/Page";

export default class NotFound extends Page {
  constructor({ lenis }) {
    super({
      id: "notFound",
      element: ".page--notFound",
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
