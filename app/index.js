import "../styles/main.scss";

// libraries
import each from "lodash/each";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";

// components
import Navigation from "@/components/navigation";
import Preloader from "@/components/preloader";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import Logo from "@/components/logo";
import Cursor from "@/components/Cursor";

// pages
import Home from "@/pages/home";
import Work from "@/pages/work";
import Blog from "@/pages/blog";
import NotFound from "@/pages/notFound";
import PageManager from "./components/PageManager";

class App {
  constructor() {
    this.createContent();

    this.initLenis();
    this.createPreloader();
    this.createPages();
    this.initNavigation();
    this.initSpotifyPlayer();
    this.addCustomCursor();

    this.addLinkListeners();
    this.addEventListeners();
    this.updateActiveLinks();
  }

  createPages() {
    this.pages = new Map();

    this.pageConfig = {
      lenis: this.lenis,
      logo: this.logo,
    };

    this.pages.set("home", new Home(this.pageConfig));
    this.pages.set("blog", new Blog(this.pageConfig));
    this.pages.set("work", new Work(this.pageConfig));
    this.pages.set("404", new NotFound(this.pageConfig));

    this.page = this.pages.get(this.template);

    this.page.create({ sourcePreloader: true });

    this.pageManager = new PageManager({
      currentTemplate: this.template,
      sourcePreloader: true,
    });
  }

  createContent() {
    this.content = document.querySelector("#content");
    this.template = this.content.getAttribute("data-template");
    this.pageType = this.content.getAttribute("data-type");
  }

  createPreloader() {
    this.initLogoComponent();
    this.preloader = new Preloader({
      logo: this.logo,
      template: this.template,
    });
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  initNavigation() {
    this.navigation = new Navigation();
  }

  initSpotifyPlayer() {
    this.spotifyPlayer = new SpotifyPlayer();
  }

  initLogoComponent() {
    this.logo = new Logo({ lenis: this.lenis });
  }

  onPreloaded() {
    window.scrollTo(0, 0);
    this.preloader.destroy();
    this.logo.addEventListeners();
    this.page.show();
    this.navigation.animateIn();
    // this.pageManager.setPageState("open");
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

  addCustomCursor() {
    this.cursor = new Cursor();
  }

  updateActiveLinks() {
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll(".header__top ul a");

    navLinks.forEach((link) => {
      if (link.href === currentUrl) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    const urlParts = currentUrl.split("/");
    const currentLanguage = urlParts[3];

    // // Update language links
    const languageLinks = document.querySelectorAll(
      ".header__top .language-toggle a"
    );

    languageLinks.forEach((link) => {
      const linkParts = link.href.split("/");
      const linkLanguage = linkParts[3];

      const listItem = link.closest("li");

      if (linkLanguage === currentLanguage) {
        listItem.classList.add("active");
      } else {
        listItem.classList.remove("active");
      }
    });
  }

  async onChange({ url, push = true }) {
    if (url === window.location.href) {
      return;
    }

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

    this.pageManager.onRouteChange({ pageType: this.pageType, url });

    this.content.setAttribute(
      "data-template",
      divContent.getAttribute("data-template")
    );

    this.content.className = divContent.className;

    this.content.innerHTML = divContent.innerHTML;

    this.page = this.pages.get(this.template);

    if (!this.page) {
      console.log(`page ${this.template} not found!`);
      this.page = this.pages.get("404");
    }

    this.page.create({ sourcePreloader: false });

    // const navContent = div.querySelector("#header nav");
    // const navContainer = document.querySelector(".header__top");

    // const newNavLinks = navContent.querySelectorAll(".header__top a");

    // const currentNavLinks = navContainer.querySelectorAll(".header__top a");

    // newNavLinks.forEach((newLink, index) => {
    //   const currentLink = currentNavLinks[index];
    //   if (currentLink) {
    //     const clonedLink = newLink.cloneNode(true);
    //     currentLink.href = clonedLink.href;
    //     currentLink.textContent = clonedLink.textContent;
    //     Array.from(clonedLink.attributes).forEach((attr) => {
    //       if (attr.name !== "id") {
    //         currentLink.setAttribute(attr.name, attr.value);
    //       }
    //     });
    //   }
    // });

    await this.spotifyPlayer.onChange();
    this.pageManager.onChange(this.template);

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
