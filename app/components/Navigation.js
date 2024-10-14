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
        clock: ".header__bottom .clock",
      },
    });

    this.timeline = gsap.timeline();
    // this.updateClock();
    // setInterval(this.updateClock.bind(this), 1000);

    this.currentFrame = 0;
    this.frameInterval = null;
  }

  animateIn() {
    // this.timeline.from(
    //   [
    //     // this.elements.get("languageToggle"),
    //     this.elements.get("links"),
    //     // this.elements.get("logo"),
    //     // this.elements.get("recordPlayer"),
    //   ],
    //   {
    //     autoAlpha: 0,
    //     duration: 1,
    //     ease: "power3.out",
    //   }
    // );
  }

  updateClock() {
    const options = {
      timeZone: "America/Toronto",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const ottawaTime = new Intl.DateTimeFormat("en-CA", options).format(
      new Date()
    );
    const [time, period] = ottawaTime.split(" ");

    const formattedTime = `${time} ${period.toUpperCase()}`;

    this.elements.get("clock").textContent = formattedTime;
  }

  addEventListeners() {
    console.log("navigation events added");

    // this.elements
    //   .get("logoContainer")
    //   .addEventListener("mouseenter", this.playFrames.bind(this));
    // this.elements
    //   .get("logoContainer")
    //   .addEventListener("mouseleave", this.pauseFrames.bind(this));
  }

  removeEventListeners() {
    // this.elements
    //   .get("logoContainer")
    //   .removeEventListener("mouseenter", this.playFrames.bind(this));
    // this.elements
    //   .get("logoContainer")
    //   .removeEventListener("mouseleave", this.pauseFrames.bind(this));
  }
}
