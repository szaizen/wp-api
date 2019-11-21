const URL = "https://liginc.co.jp";
const ARTICLE_URL = URL + "/wp-json/wp/v2/posts?_embed";
const CATEGORY_URL = URL + "/wp-json/wp/v2/categories?per_page=100";

let categoryList = [];

// カテゴリ一覧取得
requestAjax(CATEGORY_URL, function(response) {
  response.forEach(function(el) {
    categoryList.push({
      id: el.id,
      name: el.name,
      url: el.link
    });
  });
});

// 記事一覧取得
requestAjax(ARTICLE_URL, function(response) {
  addCard(response);
});

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

function addCard(response) {
  const $template = document.getElementById("js-template");
  const $add = document.getElementById("js-add");
  const DISPLAYED_NUMBER = 8;

  for (var i = 0; i < DISPLAYED_NUMBER; i++) {
    const clone = $template.firstElementChild.cloneNode(true);
    clone.getElementsByClassName("article__link")[0].href = response[i].link;
    clone.getElementsByClassName("article__title")[0].innerText =
      response[i].title.rendered;
    clone.getElementsByClassName("article__image")[0].src =
      response[i]._embedded["wp:featuredmedia"][0].source_url;

    // categoryの名前検索
    response[i].categories.forEach(function(value, index) {
      const targetList = categoryList.filter(category => {
        return category.id === value;
      });
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = targetList[0].url;
      a.target = "_blank";
      a.innerText = targetList[0].name;

      li.appendChild(a);

      clone.getElementsByClassName("article__category")[0].appendChild(li);
    });

    // 日付変換
    var date = new Date(response[i].date);
    var formatDate =
      date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();

    clone.getElementsByClassName("article__date")[0].innerText = formatDate;

    $add.appendChild(clone);
  }
}
