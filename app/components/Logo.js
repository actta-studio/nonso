import Component from "../classes/Component";
import gsap from "gsap";

export default class Logo extends Component {
  constructor({ lenis, swapSpeed = 200 }) {
    super({
      element: "#logo",
      elements: {
        baseFrame: "[data-label='base-frame']",
        routineFrames: "[data-label^='routine-frame']",
        interactionFrames: "[data-label^='interaction-frame']",
        notFoundFrames: "[data-label='not-found-frame']",
      },
    });

    console.log(lenis);

    this.lenis = lenis;
    console.log("lenis in constructor:", this.lenis);

    this.swapSpeed = swapSpeed; // Control the swap speed
    this.scrollDistance = 0;
    this.scrollThreshold = 1000;
    this.currentFrameIndex = 0;

    this.introSequence = [];
    this.buildSequences();
    this.timeline = gsap.timeline();
  }

  create() {
    super.create();
  }

  buildSequences() {
    console.log("base-frame: ", this.elements.get("baseFrame"));
    console.log("routine-frames: ", this.elements.get("routineFrames"));
    console.log("interaction-frames: ", this.elements.get("interactionFrames"));
    console.log("not-found-frames: ", this.elements.get("notFoundFrames"));

    this.introSequence = [
      this.elements.get("baseFrame"),
      ...this.elements.get("routineFrames"),
      this.elements.get("baseFrame"),
    ];
    this.baseSequence = [this.elements.get("baseFrame")];
    this.interactionSequence = [...this.elements.get("interactionFrames")];
    this.notFoundSequence = [this.elements.get("notFoundFrames")];
  }

  async reset(sequence) {
    await this.showLastFrame(sequence);
  }

  async showLastFrame(sequence, index = null) {
    this.timeline.clear();

    sequence.forEach((frame) => {
      gsap.set(frame, { display: "none" });
    });

    const lastFrame = sequence[index || sequence.length - 1];
    gsap.set(lastFrame, { display: "block" });
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
        await this.reset(this.notFoundSequence);
        break;
      default:
        await this.animateSequence(this.introSequence);
        break;
    }
  }

  onHover() {}

  addEventListeners() {
    console.log("adding wheel event listener");

    // Function to handle the wheel event
    const handleWheel = (e) => {
      const direction = e.deltaY > 0 ? 1 : -1;
      this.scrollDistance += Math.abs(e.deltaY);
      console.log("scrolling: ", e.deltaY, "direction: ", direction);

      if (this.scrollDistance >= this.scrollThreshold) {
        this.scrollDistance = 0;
        if (direction === -1) {
          this.currentFrameIndex =
            (this.currentFrameIndex - 1 + this.introSequence.length) %
            this.introSequence.length;
        } else {
          this.currentFrameIndex =
            (this.currentFrameIndex + 1) % this.introSequence.length;
        }
        this.showLastFrame(this.introSequence, this.currentFrameIndex);
      }
    };

    // Add the wheel event listener
    window.addEventListener("wheel", handleWheel);

    this.addVisibilityChangeListener();
  }

  addVisibilityChangeListener() {
    console.log("Adding visibility change listener");
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        console.log("document is hidden");
        this.showLastFrame(this.introSequence, this.introSequence.length - 2);
      } else {
        setTimeout(() => {
          console.log("document is visible");
          this.showLastFrame(this.introSequence, this.currentFrameIndex);
        }, 750);
      }
    });
  }

  removeEventListeners() {
    console.log("removing scroll event listener: ", this.lenis);
    this.lenis.off("scroll");
  }
}
