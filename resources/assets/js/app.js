import { formatData, createDom } from "./module.js";

const URL = "https://liginc.co.jp";
const ARTICLE_URL = URL + "/wp-json/wp/v2/posts?_embed";
const CATEGORY_URL = URL + "/wp-json/wp/v2/categories?per_page=100";

let categoryList = [];

/* ------------------------------------
 *  カテゴリー一覧取得し、サイドバーに表示
 *------------------------------------*/

// カテゴリ一覧取得
requestAjax(CATEGORY_URL, function(response) {
  categoryList = response.map(el => {
    return {
      id: el.id,
      name: el.name,
      url: el.link
    };
  });
  addSidebarCategoryList();
});

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

// クリックされた時の処理
function categorySearch(id) {
  console.log(id);
  let categoryListURL = ARTICLE_URL + "&categories=" + id;
  addCard(categoryListURL);
}

/* ------------------------------------
 * 記事一覧取得
 *------------------------------------*/

addCard(ARTICLE_URL);

/* ------------------------------------
 * 検索結果を表示
 *------------------------------------*/

document.getElementById("js-search-btn").addEventListener("click", () => {
  let searchUrl =
    ARTICLE_URL + "&search=" + document.getElementById("js-search-text").value;
  searchUrl = encodeURI(searchUrl);

  addCard(searchUrl);
});

/* ------------------------------------
 * 記事表示
 *------------------------------------*/

const $add = document.getElementById("js-add");
// 記事追加
function addCard(url) {
  document.getElementById("js-add").textContent = null;

  requestAjax(url, function(response) {
    if (response.length === 0) {
      $add.innerText = "該当する記事はありませんでした";
    } else {
      response.forEach(response => {
        const cardInformation = formatData(response, categoryList);
        const cardHtml = createDom(cardInformation);
        $add.appendChild(cardHtml);
      });
    }
  });
}

/* ------------------------------------
 * 関数
 *------------------------------------*/

// API取得
function requestAjax(endpoint, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.response);
    }
  };
  xhr.responseType = "json";
  xhr.open("GET", endpoint, true);
  xhr.send();
}
