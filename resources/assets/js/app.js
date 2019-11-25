import formatData from "./modules/format-data.js";
import createDom from "./modules/create-dom.js";
import { articleTotal, pagesTotal, requestApi } from "./modules/request-api.js";

const $add = document.getElementById("js-add");
const $pagenation = document.getElementById("js-pagination");

let categoryList = [];
let currentPage = 1; // 現在のページ番号

// API URL
const URL = "https://liginc.co.jp";
const ARTICLE_URL = URL + "/wp-json/wp/v2/posts?_embed&per_page=9";
const CATEGORY_URL = URL + "/wp-json/wp/v2/categories?per_page=100";
// let pageUrl = ARTICLE_URL + "page=" + currentPage;

// カテゴリー取得、サイドバー更新
requestApi(CATEGORY_URL).then(result => {
  categoryList = result.map(el => {
    return { id: el.id, name: el.name, url: el.link };
  });
  addSidebarCategoryList();
});

// 記事一覧
requestApi(ARTICLE_URL).then(result => {
  addCard(result);
});

// ページネーション
addPagenaition(currentPage);

/* ------------------------------------
 * クリックイベント
 *------------------------------------*/

// 検索時
document.getElementById("js-search-btn").addEventListener("click", () => {
  let searchUrl =
    ARTICLE_URL + "&search=" + document.getElementById("js-search-text").value;
  searchUrl = encodeURI(searchUrl);

  requestApi(searchUrl).then(result => {
    addCard(result);
  });
});

// カテゴリーボタン
async function categorySearch(id) {
  let categoryListURL = ARTICLE_URL + "&categories=" + id;
  const result = await requestApi(categoryListURL);
  addCard(result);
}

// ページネーション
$pagenation.addEventListener("click", e => {
  let clickPage = Number(e.target.dataset.pagenumber);
  addPagenaition(clickPage);

  let pageUrl = ARTICLE_URL + "&page=" + clickPage;
  requestApi(pageUrl).then(result => {
    addCard(result);
  });
});

/* ------------------------------------
 * 関数
 *------------------------------------*/

// 記事追加
function addCard(json) {
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
    categorySearch(e.target.dataset.categoryid);
  });
}

// API取得

// ページネーション更新
function addPagenaition(currentPageNumber) {
  let pagenationStartNumber = currentPageNumber - 2; // 最初のページ番号
  let pagenationEndNumber = currentPageNumber + 2; // 最後のページ番号

  if (currentPageNumber <= 2) {
    pagenationStartNumber = 1;
    pagenationEndNumber = 5;
  } else if (currentPageNumber >= pagesTotal - 2) {
    pagenationStartNumber = pagesTotal - 4;
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
