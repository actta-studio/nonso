import { map } from "lodash";

import Page from "../../classes/Page";

export default class NotFound extends Page {
  constructor({ lenis, logo }) {
    super({
      id: "404",
      element: ".page--notFound",
      elements: {},
    });

    this.lenis = lenis;
    this.logo = logo;
  }

  show() {
    super.show();
    // this.logo.animate("not-found");
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
