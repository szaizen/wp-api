import getArticleList from "./modules/get-article-list.js";
import formatData from "./modules/format-data.js";
import createDom from "./modules/create-dom.js";

const $add = document.getElementById("js-add");

export default class Article {
  constructor(url, categoryList) {
    this.url = url;
    this.categoryList = categoryList;

    this.get();

    // this.init();

    if (this.response.length === 0) {
      this.showError("該当する記事はありませんでした");
    } else {
      this.response.forEach(responseData => {
        this.responseData = responseData;
        this.format();
        this.createDom();

        $add.appendChild(cardHtml);
        this.format();
        this.createHtml();
        this.add();
      });
    }

    this.addTotal();
  }

  async get() {
    this.response = await getArticleList(this.url);
  }

  // レスポンスデータを整形する
  format() {
    this.title = this.responseData.title.rendered;
    this.url = this.responseData.link;
    this.image = this.responseData._embedded["wp:featuredmedia"][0].source_url;

    this.date = new Date(this.responseData.date);
    this.createddate =
      this.date.getFullYear() +
      "." +
      (this.date.getMonth() + 1) +
      "." +
      this.date.getDate();

    this.categoryList = this.responseData.categories.map(value => {
      const targetList = this.categoryList.filter(category => {
        return category.id === value;
      });
      return {
        name: targetList[0].name,
        url: targetList[0].url
      };
    });

    $add.textContent = null;
  }

  // HTML作成
  createHtml() {
    const $template = document.getElementById("js-template");
    this.clone = $template.firstElementChild.cloneNode(true);

    this.clone.getElementsByClassName("article__link")[0].href = this.url;
    this.clone.getElementsByClassName(
      "article__title"
    )[0].innerText = this.title;
    this.clone.getElementsByClassName("article__image")[0].src = this.image;
    this.clone.getElementsByClassName(
      "article__date"
    )[0].innerText = this.createddate;

    let $ul = this.clone.getElementsByClassName("article__category")[0];
    $ul.innerHTML = this.categoryList
      .map(
        item =>
          `<li><a target="_blank" href="${item.url}">${item.name}</a></li>`
      )
      .join("");
  }

  // DOM追加
  add() {
    $add.appendChild(this.clone);
  }

  // 記事総件数 追加
  addTotal() {
    document.getElementById(
      "js-article-total"
    ).innerText = this.response.articleTotal;
  }

  showError(message) {
    $add.innerText = message;
  }
}
