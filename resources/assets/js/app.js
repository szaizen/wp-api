import formatData from "./modules/format-data.js";
import createDom from "./modules/create-dom.js";
import requestApi from "./modules/request-api.js";
import getApiUrl from "./modules/get-api-url.js";
import Pagination from "./class/pagination.js";

const $add = document.getElementById("js-add");
const $pagination = document.getElementById("js-pagination");
const $search = document.getElementById("js-search-btn");

let categoryList = [];

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
$pagination.addEventListener("click", e => {
  let clickPage = Number(e.target.dataset.pagenumber);
  currentData.page = clickPage;
  addCard();
});

/* ------------------------------------
 * 関数
 *------------------------------------*/

// カテゴリー追加
async function addCategory() {
  let result = await requestApi(CATEGORY_URL);
  categoryList = result.response.map(el => {
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
  let url = API_URL + encodeURI(getApiUrl(currentData)); // アクセスするAPIURLを生成
  let result = await requestApi(url); // データ取得
  let response = result.response; // データ内からresponseを取り出す
  let articleTotal = result.getResponseHeader("x-wp-total"); // データ内から総記事数を取り出す

  $add.textContent = null; // HTMLリセット
  if (response.length === 0) {
    $add.innerText = "該当する記事はありませんでした";
  } else {
    response.forEach(response => {
      const cardInformation = formatData(response, categoryList); // データを整形
      const cardHtml = createDom(cardInformation); // HTML作成
      $add.appendChild(cardHtml); // HTML書き込み
    });
  }

  // 記事総件数 追加
  document.getElementById("js-article-total").innerText = articleTotal;
  // ページネーション更新
  new Pagination(
    currentData.page,
    5,
    result.getResponseHeader("x-wp-totalpages"),
    $pagination
  );
}
