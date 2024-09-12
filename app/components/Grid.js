export default class Grid {
  constructor(count) {
    // extend the config to include gutter, a check for device width and margins.
    this.count = count;
  }

  create() {
    if (window.location.hash.indexOf("grid") === -1) return;

    this.grid = document.createElement("div");
    this.grid.classList.add("design-grid");
    document.body.appendChild(this.grid);
    this.show();
  }

  show() {
    for (let i = 0; i < this.count; i++) {
      let div = document.createElement("div");
      div.classList.add("column");
      this.grid.appendChild(div);
    }
  }
}
