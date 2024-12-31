import Component from "../classes/Component";
import gsap from "gsap";

export default class PageManager extends Component {
  constructor({ currentTemplate }) {
    super({
      id: "page-manager",
      element: "#page-manager",
      elements: {
        logoContainer: ".logo-container",
        pageToggle: "#page-toggle",
      },
    });

    this.currentTemplate = currentTemplate;

    this.addEventListeners();
    this.init();
  }

  init() {
    if (this.currentTemplate === "home" || this.currentTemplate === "404") {
      this.setToggleState("hidden");
    } else {
      this.setToggleState("open");
    }
  }

  setToggleState(state) {
    const pageToggle = this.elements.get("pageToggle");

    if (!pageToggle) {
      console.error("pageToggle element not found");
      return;
    }

    switch (state) {
      case "open":
        if (!pageToggle.classList.contains("open")) {
          pageToggle.classList.remove("hidden");
          pageToggle.classList.add("open");
        }
        break;
      case "close":
        if (!pageToggle.classList.contains("hidden")) {
          pageToggle.classList.remove("open");
          pageToggle.classList.add("hidden");
        }
        break;
      case "hidden":
        if (!pageToggle.classList.contains("hidden")) {
          pageToggle.classList.remove("open", "hidden");
          pageToggle.classList.add("hidden");
        }
        break;
      default:
        console.warn(`Unknown state: ${state}`);
        break;
    }
  }

  onRouteChange({ pageType, url }) {
    if (url === window.location.href) return;
  }

  addEventListeners() {
    console.log("page manager events added");
    console.log(this.elements);

    this.elements.get("pageToggle").addEventListener("click", () => {
      this.handlePageToggle();
    });
  }

  handlePageToggle() {
    const pageToggle = this.elements.get("pageToggle");

    if (pageToggle.classList.contains("open")) {
      this.setToggleState("close");
      gsap.to(this.elements.get("logoContainer"), {
        "--columns": 12,
        ease: "steps(1)",
      });
    } else {
      this.setToggleState("open");
      gsap.to(this.elements.get("logoContainer"), {
        "--columns": 5,
        ease: "steps(1)",
      });
    }
  }

  removeEventListeners() {}
}
