export default class Pagenation {
  constructor(current, pagenationTotal, pageTotal, $pagenation) {
    this.current = current; // 現在いるページ
    this.pagenationTotal = pagenationTotal; // ページネーション表示数
    this.pageTotal = pageTotal; // ページ総数
    this.$pagenation = $pagenation;
    this.html = "";
    this.init();
    this.reset();
    this.createDom();
    this.show();
  }

  init() {
    this.totalHalf = (this.pagenationTotal - 1) / 2;
    this.start = this.current - 2;
    this.end = this.current + 2;

    if (this.current <= this.totalHalf) {
      this.start = 1;
      this.end = this.pagenationTotal;
    } else if (this.current >= this.pageTotal - this.totalHalf) {
      this.start = this.pagenationTotal - 4;
      this.end = this.pagenationTotal;
    }
    if (this.pageTotal < 5) {
      this.end = this.pageTotal;
    }
  }

  reset() {
    this.$pagenation.innerHTML = "";
  }

  createDom() {
    for (var i = this.start; i <= this.end; i++) {
      this.pagenationClass = "pagination-link";
      if (i === this.current) {
        this.pagenationClass = "pagination-link is-current";
      }
      this.html += `<li><a data-pagenumber="${i}" class="${this.pagenationClass}">${i}</a></li>`;
    }
  }

  show() {
    this.$pagenation.innerHTML = this.html;
  }
}
