import Component from "../classes/Component";
import gsap from "gsap";

export default class Navigation extends Component {
  constructor() {
    super({
      element: "header.header",
      elements: {
        languageToggle: "header.header .language-toggle",
        links: ".header__top .navigation .navigation__link",
        recordPlayer: "header.header .record-player",
      },
    });

    this.timeline = gsap.timeline();

    this.addEventListeners();
  }

  animateIn() {
    this.timeline.from(
      [
        this.elements.get("languageToggle"),
        this.elements.get("links"),
        this.elements.get("recordPlayer"),
      ],
      {
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
      }
    );
  }

  addEventListeners() {
    console.log("navigation events added");
  }

  removeEventListeners() {}
}
