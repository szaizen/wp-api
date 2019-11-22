import formatData from "./modules/formatData.js";
import createDom from "./modules/createDom.js";

const $add = document.getElementById("js-add");

const URL = "https://liginc.co.jp";
const ARTICLE_URL = URL + "/wp-json/wp/v2/posts?_embed";
const CATEGORY_URL = URL + "/wp-json/wp/v2/categories?per_page=100";
let categoryList = [];

// カテゴリー
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

/* ------------------------------------
 * 検索ボタンクリック
 *------------------------------------*/
document.getElementById("js-search-btn").addEventListener("click", () => {
  let searchUrl =
    ARTICLE_URL + "&search=" + document.getElementById("js-search-text").value;
  searchUrl = encodeURI(searchUrl);

  requestApi(searchUrl).then(result => {
    addCard(result);
  });
});

/* ------------------------------------
 * カテゴリーボタンクリック
 *------------------------------------*/
function categorySearch(id) {
  let categoryListURL = ARTICLE_URL + "&categories=" + id;
  requestApi(categoryListURL).then(result => {
    addCard(result);
  });
}

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
  }
}

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
function get(url) {
  return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        resolve(this.response);
      }
    };
    xhr.responseType = "json";
    xhr.open("GET", url, true);
    xhr.send();
  });
}
async function requestApi(url) {
  const result = await get(url);
  return result;
}
