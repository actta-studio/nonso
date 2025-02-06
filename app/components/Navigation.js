import Component from "../classes/Component";
import gsap from "gsap";

export default class Navigation extends Component {
  constructor() {
    super({
      element: "header.header",
      elements: {
        navigation: "header.header",
      },
    });

    this.timeline = gsap.timeline();

    this.addEventListeners();
  }

  animateIn() {
    // return;
    this.timeline.from([this.elements.get("navigation")], {
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
    });
  }

  addEventListeners() {
    console.log("navigation events added");
  }

  removeEventListeners() {}
}
