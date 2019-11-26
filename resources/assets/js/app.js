import formatData from "./modules/format-data.js";
import createDom from "./modules/create-dom.js";
import { articleTotal, pagesTotal, requestApi } from "./modules/request-api.js";
import getApiUrl from "./modules/get-api-url.js";
import Pagenation from "./modules/pagenation.js";

const $add = document.getElementById("js-add");
const $pagenation = document.getElementById("js-pagination");

let categoryList = [];

let currentType = "post"; // post or category or search
let currentPage = 1; // 現在のページ番号
let searchText = "";
let cateogyrId = "";

// API URL
const API_URL = "https://liginc.co.jp/wp-json/wp/v2/posts?_embed&per_page=9";
const CATEGORY_URL =
  "https://liginc.co.jp/wp-json/wp/v2/categories?per_page=100";

// カテゴリー取得、サイドバー更新
addCategory();

// 記事一覧
addCard();

/* ------------------------------------
 * クリックイベント
 *------------------------------------*/

// 検索時
document.getElementById("js-search-btn").addEventListener("click", () => {
  currentType = "search";
  currentPage = 1;
  searchText = document.getElementById("js-search-text").value;
  addCard();
});

// ページネーション

$pagenation.addEventListener("click", e => {
  let clickPage = Number(e.target.dataset.pagenumber);
  currentPage = clickPage;
  addCard();
});

/* ------------------------------------
 * 関数
 *------------------------------------*/

// カテゴリー追加
async function addCategory() {
  let result = await requestApi(CATEGORY_URL);
  categoryList = result.map(el => {
    return { id: el.id, name: el.name, url: el.link };
  });
  addSidebarCategoryList();
}

// サイドバーにカテゴリー一覧表示
function addSidebarCategoryList() {
  let $ul = document.getElementById("js-category-list");
  $ul.innerHTML = categoryList
    .map(item => `<li data-categoryid="${item.id}">${item.name}</li>`)
    .join("");
  $ul.addEventListener("click", e => {
    cateogyrId = e.target.dataset.categoryid;
    currentPage = 1;
    currentType = "category";
    addCard();
  });
}

// 記事追加
async function addCard() {
  let url =
    API_URL +
    encodeURI(getApiUrl(currentType, currentPage, searchText, cateogyrId));
  const json = await requestApi(url);

  // addPagenaition(currentPage);
  new Pagenation(currentPage, 5, pagesTotal, $pagenation);

  document.getElementById("js-add").textContent = null;
  if (json.length === 0) {
    showError("該当する記事はありませんでした");
  } else {
    json.forEach(json => {
      const cardInformation = formatData(json, categoryList);
      const cardHtml = createDom(cardInformation);
      $add.appendChild(cardHtml);
    });
    addTotal();
  }
}

// 記事総件数 追加
function addTotal() {
  document.getElementById("js-article-total").innerText = articleTotal;
}

// エラー表示
function showError(message) {
  $add.innerText = message;
}
