import Component from "../classes/Component";
import gsap from "gsap";

export default class Transition extends Component {
  constructor() {
    super({
      element: ".page-transition",
      elements: {},
    });

    this.timeline = gsap.timeline();

    // this.timeline.to(this.element, {
    //   autoAlpha: 1,
    // });
  }

  animateIn() {
    this.timeline = gsap.timeline();

    return new Promise((resolve) => {});
  }

  animateOut() {
    this.timeline = gsap.timeline();

    return new Promise((resolve) => {});
  }
}
