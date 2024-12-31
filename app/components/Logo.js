import Component from "../classes/Component";
import gsap from "gsap";

export default class Logo extends Component {
  constructor({ lenis, swapSpeed = 200 }) {
    super({
      element: "#logo",
      elements: {
        eventCapture: "#logo .event-capture",
        baseFrame: "[data-label='base-frame']",
        routineFrames: "[data-label^='routine-frame']",
        interactionFrames: "[data-label^='interaction-frame']",
        notFoundFrames: "[data-label='not-found-frame']",
      },
    });

    this.lenis = lenis;

    this.introSequence = [];
    this.buildSequences();
    this.timeline = gsap.timeline();
  }

  create() {
    super.create();
  }

  updateDimensions() {
    const firstImage = this.introSequence[0].querySelector("img");
    if (firstImage) {
      const { width, height } = firstImage.getBoundingClientRect();
      this.element.style.setProperty("--width", `${width}px`);
      this.element.style.setProperty("--height", `${height}px`);
    }
  }

  buildSequences() {
    this.introSequence = [
      this.elements.get("baseFrame"),
      ...this.elements.get("routineFrames"),
      this.elements.get("baseFrame"),
    ];
    this.baseSequence = [this.elements.get("baseFrame")];
    this.interactionSequence = [...this.elements.get("interactionFrames")];
    this.notFoundSequence = [
      ...this.elements.get("routineFrames"),
      this.elements.get("notFoundFrames"),
    ];
  }

  async reset(sequence, index = null) {
    await this.showLastFrame(sequence, index);
  }

  async showLastFrame(sequence, index = null) {
    this.timeline.clear();

    sequence.forEach((frame) => {
      gsap.set(frame, { display: "none" });
      frame.classList.remove("visible");
    });

    const frameIndex = index !== null ? index : sequence.length - 1;
    const lastFrame = sequence[frameIndex];
    gsap.set(lastFrame, { display: "block" });
    lastFrame.classList.add("visible");
  }

  animateSequence(sequence, duration = 0.25) {
    return new Promise((resolve) => {
      this.timeline.clear();

      sequence.forEach((frame, index) => {
        this.timeline.set(frame, {
          display: "block",
        });

        this.timeline.set(
          frame,
          {
            display: "none",
          },
          `+=${duration}`
        );
      });

      this.timeline.call(resolve, null, null, `+=${duration}`);
    });
  }

  async animate(sequence) {
    switch (sequence) {
      case "intro":
        await this.animateSequence(this.introSequence);
        await this.reset(this.introSequence);
        break;
      case "interaction":
        await this.animateSequence(this.interactionSequence);
        break;
      case "not-found":
        await this.animateSequence(this.notFoundSequence);
        await this.reset(this.notFoundSequence);
        break;
      default:
        await this.animateSequence(this.introSequence);
        break;
    }
  }

  onHover() {}

  addEventListeners() {
    this.addVisibilityChangeListener();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.addHoverEventListener();
    this.updateDimensions();
  }

  addHoverEventListener() {
    console.log(this.element);

    this.elements.get("eventCapture").addEventListener("mouseenter", () => {
      this.onMouseEnter();
    });

    this.elements.get("eventCapture").removeEventListener("mouseenter", () => {
      this.onMouseEnter();
    });

    this.elements.get("eventCapture").addEventListener("mouseleave", () => {
      this.onMouseLeave();
    });

    this.elements.get("eventCapture").removeEventListener("mouseleave", () => {
      this.onMouseLeave();
    });
  }

  async onMouseEnter() {
    console.log("onMouseEnter");
    await this.reset(this.introSequence, 1);
  }

  async onMouseLeave() {
    console.log("onMouseLeave");
    await this.reset(this.introSequence, 0);
  }

  addVisibilityChangeListener() {
    let lastRandomIndex = -1;

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        let randomIndex;
        do {
          randomIndex =
            Math.floor(Math.random() * (this.introSequence.length - 2)) + 1;
        } while (randomIndex === lastRandomIndex);

        lastRandomIndex = randomIndex;
        this.showLastFrame(this.introSequence, randomIndex);
      } else {
        setTimeout(() => {
          this.showLastFrame(this.introSequence);
        }, 950);
      }
    });
  }

  removeEventListeners() {
    this.lenis.off("scroll");
    window.removeEventListener("resize", this.updateDimensions.bind(this));
    window.removeEventListener("load", this.updateDimensions.bind(this));
  }
}
