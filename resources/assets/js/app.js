import formatData from "./modules/format-data.js";
import createDom from "./modules/create-dom.js";
import getArticleList from "./modules/get-article-list.js";
import getCategoryList from "./modules/get-category-list.js";
import getApiUrl from "./modules/get-api-url.js";
import Pagenation from "./class/pagenation.js";

const $add = document.getElementById("js-add");
const $pagenation = document.getElementById("js-pagination");
const $search = document.getElementById("js-search-btn");

let categoryList = [];
let articleTotal = 0;

let currentData = {
  type: "post", // post or category or search
  page: 1, // 現在のページ番号
  searchText: "", // 検索時のワード
  cateogyrId: "" // カテゴリー検索時のID
};

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
$search.addEventListener("click", () => {
  currentData.type = "search";
  currentData.page = 1;
  currentData.searchText = document.getElementById("js-search-text").value;
  addCard();
});

// ページネーション

$pagenation.addEventListener("click", e => {
  let clickPage = Number(e.target.dataset.pagenumber);
  currentData.page = clickPage;
  addCard();
});

/* ------------------------------------
 * 関数
 *------------------------------------*/

// カテゴリー追加
async function addCategory() {
  let result = await getCategoryList(CATEGORY_URL);
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
    currentData.cateogyrId = e.target.dataset.categoryid;
    currentData.page = 1;
    currentData.type = "category";
    addCard();
  });
}

// 記事追加
async function addCard() {
  let url = API_URL + encodeURI(getApiUrl(currentData));

  const result = await getArticleList(url);
  const response = result.response;
  articleTotal = result.articleTotal;

  // ページネーション更新
  new Pagenation(currentData.page, 5, result.pagesTotal, $pagenation);

  document.getElementById("js-add").textContent = null;
  if (response.length === 0) {
    showError("該当する記事はありませんでした");
  } else {
    response.forEach(response => {
      const cardInformation = formatData(response, categoryList);
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
