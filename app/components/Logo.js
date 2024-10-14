import Component from "../classes/Component";
import gsap from "gsap";

export default class Logo extends Component {
  constructor() {
    super({
      element: "#logo",
      elements: {
        baseFrame: "[data-label='base-frame']",
        routineFrames: "[data-label^='routine-frame']",
        interactionFrames: "[data-label^='interaction-frame']",
        notFoundFrames: "[data-label='not-found-frame']",
      },
    });

    this.introSequence = [];
    this.buildSequences();
    this.timeline = gsap.timeline();
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

  async showLastFrame(sequence) {
    this.timeline.clear();

    // Hide all frames first
    sequence.forEach((frame) => {
      gsap.set(frame, { display: "none" });
    });

    // Show the last frame
    const lastFrame = sequence[sequence.length - 1];
    gsap.set(lastFrame, { display: "block" });
  }

  animateSequence(sequence, duration = 0.3) {
    return new Promise((resolve) => {
      this.timeline.clear();

      // Iterate over each frame in the sequence
      sequence.forEach((frame, index) => {
        // Show the current frame
        this.timeline.set(frame, {
          display: "block",
        });

        // Hide the current frame after a delay
        this.timeline.set(
          frame,
          {
            display: "none",
          },
          `+=${duration}`
        );
      });

      // Resolve the promise after the last frame is hidden
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

  addEventListeners() {}

  removeEventListeners() {}
}
