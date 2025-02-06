import Component from "../classes/Component";
import gsap from "gsap";

export default class PageManager extends Component {
  constructor({ currentTemplate, sourcePreloader }) {
    super({
      id: "page-manager",
      element: "#page-manager",
      elements: {
        overlay: "#page-manager #overlay",
        logoContainer: ".logo-container",
        toggle: "#page-toggle",
      },
    });

    this.currentTemplate = currentTemplate;

    this.addEventListeners();
    this.init(this.currentTemplate);
  }

  init(template) {
    if (template === "404") {
      this.elements.get("toggle").classList.add("hidden");
    }
  }

  onChange(template) {
    this.init(template);
    this.setPageStateOpen();
  }

  setPageStateOpen() {
    this.elements.get("overlay").classList.remove("closed");
    this.elements.get("logoContainer").classList.add("closed");
  }

  setPageStateClosed() {
    this.elements.get("overlay").classList.add("closed");
    this.elements.get("logoContainer").classList.remove("closed");
  }

  toggleOverlay() {
    this.elements.get("overlay").classList.toggle("closed");
    this.elements.get("logoContainer").classList.toggle("closed");
  }

  onRouteChange({ url }) {
    if (url === window.location.href) return;
  }

  addEventListeners() {
    console.log("page manager events added");
    console.log(this.elements);
    this.elements.get("toggle").addEventListener("click", () => {
      this.toggleOverlay();
    });

    window.addEventListener("resize", () => {
      this.setPageStateClosed();
    });
  }

  removeEventListeners() {}
}
