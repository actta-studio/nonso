import Component from "../classes/Component";
import gsap from "gsap";

export default class Cursor extends Component {
  constructor() {
    super({
      element: "#cursor",
    });

    this.addEventListeners();
  }

  create() {
    super.create();
  }

  addEventListeners() {
    console.log(this.element);
  }

  removeEventListeners() {}
}
