import "../styles/main.scss";

import each from "lodash/each";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";

import Home from "@/pages/home";
import NotFound from "@/pages/notFound";
import Preloader from "@/components/preloader";

class App {
  constructor() {
    console.log("App has been initialized!");

    this.createContent();

    this.initLenis();
    this.createPreloader();
    this.createPages();
    // design grid

    this.addLinkListeners();
    this.addEventListeners();
  }

  createPages() {
    this.pages = new Map();

    this.pages.set("home", new Home({ lenis: this.lenis }));
    // this.pages.set("home", new Home({ lenis: this.lenis }));
    this.pages.set("404", new NotFound({ lenis: this.lenis }));

    this.page = this.pages.get(this.template);

    console.log("this.page - ", this.page);
    this.page.create({ sourcePreloader: true });
    // this.page.show();
  }

  createContent() {
    this.content = document.querySelector("#content");
    this.template = this.content.getAttribute("data-template");
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  onPreloaded() {
    window.scrollTo(0, 0);
    console.log("Preloaded!");
    this.preloader.destroy();
    this.page.show();
  }

  initLenis() {
    window.scrollTo(0, 0);
    this.lenis = new Lenis({
      easing: (x) => {
        return -(Math.cos(Math.PI * x) - 1) / 2;
      },
    });

    this.raf = this.raf.bind(this);
    requestAnimationFrame(this.raf);

    this.lenis.stop();
  }

  suspendScroll() {
    this.lenis.stop();
  }

  resumeScroll() {
    this.lenis.start();
  }

  raf(time) {
    this.lenis.raf(time);
    requestAnimationFrame(this.raf);
  }

  async onChange({ url, push = true }) {
    if (url === window.location.href) return;

    console.log("onChange", url);

    if (url.includes("/shop") && window.location.href.includes("/shop")) {
      await this.pages.get("shop").animateOutProducts();
    }

    window.scrollTo(0, 0);

    this.page.hide();

    const request = await window.fetch(url);

    const html = await request.text();
    const div = document.createElement("div");
    if (push) {
      window.history.pushState({}, "", url);
    }

    div.innerHTML = html;
    const divContent = div.querySelector("#content");
    this.template = divContent.getAttribute("data-template");

    this.content.setAttribute(
      "data-template",
      divContent.getAttribute("data-template")
    );

    this.content.innerHTML = divContent.innerHTML;

    this.page = this.pages.get(this.template);

    if (!this.page) {
      console.log(`page ${this.template} not found!`);
      this.page = this.pages.get("404");
    }

    this.page.create({ sourcePreloader: false });
    this.page.show();
    this.addLinkListeners();
  }

  async onPopState() {
    await this.onChange({ url: window.location.pathname, push: false });
  }

  addEventListeners() {
    window.addEventListener("popstate", this.onPopState.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener("popstate", this.onPopState.bind(this));
  }

  addLinkListeners() {
    const allLinks = document.querySelectorAll("a");
    const disabledLinks = document.querySelectorAll("a[data-state='disabled']");

    each(disabledLinks, (link) => {
      link.onclick = (event) => {
        event.preventDefault();
      };
    });

    const links = Array.from(allLinks).filter(
      (link) =>
        link.getAttribute("data-state") !== "disabled" &&
        link.getAttribute("data-link") !== "external"
    );

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();
        const { href } = link;

        this.onChange({ url: href });
      };
    });
  }
}

new App();
