const URL = "https://liginc.co.jp";
const ARTICLE_URL = URL + "/wp-json/wp/v2/posts?_embed";
const CATEGORY_URL = URL + "/wp-json/wp/v2/categories?per_page=100";

let categoryList = [];

/* ------------------------------------
 *  カテゴリー一覧取得し、サイドバーに表示
 *------------------------------------*/

// カテゴリ一覧取得
requestAjax(CATEGORY_URL, function(response) {
  response.forEach(function(el) {
    categoryList.push({
      id: el.id,
      name: el.name,
      url: el.link
    });
  });
  addSidebarCategoryList();
});

// サイドバーにカテゴリー一覧表示
function addSidebarCategoryList() {
  categoryList.forEach(function(el) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "js-category-id";
    a.onclick = function() {
      categorySearch(el.id);
    };
    a.innerText = el.name;
    li.appendChild(a);
    document.getElementById("js-category-list").appendChild(li);
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

document.getElementById("js-search-btn").onclick = function() {
  let searchUrl =
    ARTICLE_URL + "&search=" + document.getElementById("js-search-text").value;
  searchUrl = encodeURI(searchUrl);

  addCard(searchUrl);
};

/* ------------------------------------
 * 記事表示
 *------------------------------------*/

const $template = document.getElementById("js-template");
const $add = document.getElementById("js-add");
let responseTitle = "";
let responseLink = "";
let responseImage = "";
let responseDate = "";
let responseCategory = [];

function addCard(url) {
  document.getElementById("js-add").textContent = null;

  requestAjax(url, function(response) {
    if (response.length === 0) {
      $add.innerText = "該当する記事はありませんでした";
    } else {
      response.forEach(el => {
        dataFormat(el);
      });
    }
  });
}

function dataFormat(response) {
  responseCategory = [];

  responseTitle = response.title.rendered;
  responseLink = response.link;
  responseImage = response._embedded["wp:featuredmedia"][0].source_url;

  let date = new Date(response.date);
  let responseDate =
    date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();

  response.categories.forEach(function(value) {
    const targetList = categoryList.filter(category => {
      return category.id === value;
    });
    responseCategory.push({
      name: targetList[0].name,
      url: targetList[0].url
    });
  });

  createDom();
}

// card型で表示するDOM用意
function createDom() {
  let clone = $template.firstElementChild.cloneNode(true);
  clone.getElementsByClassName("article__link")[0].href = responseLink;
  clone.getElementsByClassName("article__title")[0].innerText = responseTitle;
  clone.getElementsByClassName("article__image")[0].src = responseImage;
  clone.getElementsByClassName("article__date")[0].innerText = responseDate;

  responseCategory.forEach(el => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = el.url;
    a.target = "_blank";
    a.innerText = el.name;
    li.appendChild(a);
    clone.getElementsByClassName("article__category")[0].appendChild(li);
  });

  $add.appendChild(clone);
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
