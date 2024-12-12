import Component from "../classes/Component";
import gsap from "gsap";

export default class PageManager extends Component {
  constructor() {
    super({
      element: "#page-manager",
      elements: {
        modalContainer: "#page-manager .modal-container",
      },
    });

    this.addEventListeners();
  }

  onRouteChange({ pageType, url }) {
    // if (url === window.location.href) return;

    // considerations:
    // if path is the same as the current path and page type is modal - close modal (toggle)
    // if path is different from the current path and page type is modal - close modal (toggle)
    console.log("page manager route change");
    console.log(pageType);

    console.log(
      "this.elements.get('modalContainer') - ",
      this.elements.get("modalContainer")
    );

    const modalContainer = this.elements.get("modalContainer");
    const isModalOpen = modalContainer.classList.contains("open");

    if (pageType === "modal") {
      if (isModalOpen) {
        // Close modal
        gsap.to(modalContainer, {
          duration: 0.5,
          scaleY: 0,
          onComplete: () => {
            modalContainer.classList.remove("open");
          },
        });
      } else {
        // Open modal
        gsap.to(modalContainer, {
          duration: 0.5,
          scaleY: 1,
          onStart: () => {
            modalContainer.classList.add("open");
          },
        });
      }
    } else {
      if (isModalOpen) {
        gsap.to(modalContainer, {
          duration: 0.5,
          scaleY: 0,
          onComplete: () => {
            modalContainer.classList.remove("open");
          },
        });
      }
    }
  }

  addEventListeners() {
    console.log("page manager events added");
  }

  removeEventListeners() {}
}
