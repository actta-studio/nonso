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
        notFoundFrames: "[data-label='not-found-frame']",
      },
    });

    this.lenis = lenis;

    this.introSequence = [];
    this.buildSequences();
    this.timeline = gsap.timeline();
    this.isCollapsed = false;
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

  animateSequence(sequence, duration = 0.25, skip = []) {
    return new Promise((resolve) => {
      this.timeline.clear();

      sequence.forEach((frame, index) => {
        if (!skip.includes(index)) {
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
        } else {
          gsap.set(frame, { display: "none" });
        }
      });

      this.timeline.call(resolve, null, null, `+=${duration}`);
    });
  }

  async animate(sequence, skip = []) {
    switch (sequence) {
      case "intro":
        await this.animateSequence(this.introSequence, 0.25, skip);
        await this.reset(this.introSequence);
        break;
      case "not-found":
        await this.animateSequence(this.notFoundSequence, 0.25, skip);
        await this.reset(this.notFoundSequence);
        break;
      default:
        await this.animateSequence(this.introSequence, 0.25, skip);
        break;
    }
  }

  async onExpanded() {
    this.isCollapsed = false;
    await this.reset(this.introSequence, 0);
  }

  async onCollapsed() {
    this.isCollapsed = true;
    await this.reset(this.introSequence, 2);
  }

  addEventListeners() {
    this.addVisibilityChangeListener();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.addHoverEventListener();
    this.updateDimensions();

    const logoContainer = document.querySelector(".logo-container");
    const observer = new MutationObserver(() => {
      if (window.innerWidth > 430) {
        if (logoContainer.classList.contains("closed")) {
          this.onCollapsed();
        } else {
          this.onExpanded();
        }
      }
    });

    observer.observe(logoContainer, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 430) {
        this.reset(this.introSequence, 0);
      }
    });
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
    if (this.isCollapsed) return;
    await this.reset(this.introSequence, 1);
  }

  async onMouseLeave() {
    if (this.isCollapsed) return;
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
