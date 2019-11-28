export default class Pagination {
  constructor(current, pagiationTotal, pageTotal, $pagination) {
    this.current = current; // 現在いるページ
    this.pagiationTotal = pagiationTotal; // ページネーション表示数
    this.pageTotal = pageTotal; // ページ総数
    this.$pagination = $pagination;
    this.html = "";
    this.init();
    this.reset();
    this.createDom();
    this.show();
  }

  init() {
    this.totalHalf = (this.pagiationTotal - 1) / 2;
    this.start = this.current - 2;
    this.end = this.current + 2;

    if (this.current <= this.totalHalf) {
      this.start = 1;
      this.end = this.pagiationTotal;
    } else if (this.current >= this.pageTotal - this.totalHalf) {
      this.start = this.pagiationTotal - 4;
      this.end = this.pagiationTotal;
    }
    if (this.pageTotal < 5) {
      this.end = this.pageTotal;
    }
  }

  reset() {
    this.$pagination.innerHTML = "";
  }

  createDom() {
    for (var i = this.start; i <= this.end; i++) {
      this.paginationClass = "pagination-link";
      if (i === this.current) {
        this.paginationClass = "pagination-link is-current";
      }
      this.html += `<li><a data-pagenumber="${i}" class="${this.paginationClass}">${i}</a></li>`;
    }
  }

  show() {
    this.$pagination.innerHTML = this.html;
  }
}
