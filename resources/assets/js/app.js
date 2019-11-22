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

const $template = document.getElementById("js-template");
const $add = document.getElementById("js-add");

// 記事追加
function addCard(url) {
  document.getElementById("js-add").textContent = null;

  requestAjax(url, function(response) {
    if (response.length === 0) {
      $add.innerText = "該当する記事はありませんでした";
    } else {
      response.forEach(response => {
        const cardInformation = formatData(response);
        createDom(cardInformation);
      });
    }
  });
}

// レスポンスデータを整形
function formatData(response) {
  let date = new Date(response.date);
  date =
    date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();

  const responseCategory = response.categories.map(value => {
    const targetList = categoryList.filter(category => {
      return category.id === value;
    });
    return {
      name: targetList[0].name,
      url: targetList[0].url
    };
  });

  return {
    title: response.title.rendered,
    url: response.link,
    image: response._embedded["wp:featuredmedia"][0].source_url,
    createddate: date,
    categoryList: responseCategory
  };
}

// card型で表示するDOM用意
function createDom(response) {
  let clone = $template.firstElementChild.cloneNode(true);
  clone.getElementsByClassName("article__link")[0].href = response.url;
  clone.getElementsByClassName("article__title")[0].innerText = response.title;
  clone.getElementsByClassName("article__image")[0].src = response.image;
  clone.getElementsByClassName("article__date")[0].innerText =
    response.createddate;

  let $ul = clone.getElementsByClassName("article__category")[0];
  $ul.innerHTML = response.categoryList
    .map(
      item => `<li><a target="_blank" href="${item.url}">${item.name}</a></li>`
    )
    .join("");

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
