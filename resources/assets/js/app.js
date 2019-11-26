import formatData from "./modules/format-data.js";
import createDom from "./modules/create-dom.js";
import { articleTotal, pagesTotal, requestApi } from "./modules/request-api.js";
import getApiUrl from "./modules/get-api-url.js";

const $add = document.getElementById("js-add");
const $pagenation = document.getElementById("js-pagination");

let categoryList = [];

export let currentType = "post"; // post or category or search
export let currentPage = 1; // 現在のページ番号
export let searchText = "";
export let cateogyrId = "";

// API URL
export const API_URL =
  "https://liginc.co.jp/wp-json/wp/v2/posts?_embed&per_page=9";
const CATEGORY_URL =
  "https://liginc.co.jp/wp-json/wp/v2/categories?per_page=100";

// カテゴリー取得、サイドバー更新
requestApi(CATEGORY_URL).then(result => {
  categoryList = result.map(el => {
    return { id: el.id, name: el.name, url: el.link };
  });
  addSidebarCategoryList();
});

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

// カテゴリーボタン
async function categorySearch(id) {
  currentType = "category";
  addCard();
}

// ページネーション
$pagenation.addEventListener("click", e => {
  let clickPage = Number(e.target.dataset.pagenumber);

  currentPage = clickPage;
  addCard();

  addPagenaition(clickPage);
});

/* ------------------------------------
 * 関数
 *------------------------------------*/

// 記事追加
async function addCard() {
  let url = encodeURI(getApiUrl());
  const json = await requestApi(url);

  addPagenaition(currentPage);

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

function addTotal() {
  document.getElementById("js-article-total").innerText = articleTotal;
}

// エラー表示
function showError(message) {
  $add.innerText = message;
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
    categorySearch();
  });
}

// ページネーション更新
function addPagenaition(currentPageNumber) {
  let pagenationStartNumber = currentPageNumber - 2; // 最初のページ番号
  let pagenationEndNumber = currentPageNumber + 2; // 最後のページ番号

  if (currentPageNumber <= 2) {
    pagenationStartNumber = 1;
    pagenationEndNumber = 5;
  } else if (currentPageNumber >= pagesTotal - 2 && currentPageNumber >= 5) {
    pagenationStartNumber = pagesTotal - 4;
    pagenationEndNumber = pagesTotal;
  }

  if (pagesTotal < 5) {
    pagenationEndNumber = pagesTotal;
  }

  let pagenationHtml = "";
  $pagenation.innerHTML = "";

  for (var i = pagenationStartNumber; i <= pagenationEndNumber; i++) {
    let pagenationClass = "pagination-link";
    if (i === currentPageNumber) {
      pagenationClass = "pagination-link is-current";
    }
    pagenationHtml += `<li><a data-pagenumber="${i}" class="${pagenationClass}">${i}</a></li>`;
  }
  $pagenation.innerHTML = pagenationHtml;
}
