const URL = "https://liginc.co.jp";
const API_URL = URL + "/wp-json/wp/v2/posts";

requestAjax(API_URL, function(response) {
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
  const DISPLAYED_NUMBER = 10;

  for (var i = 0; i < DISPLAYED_NUMBER; i++) {
    let clone = $template.firstElementChild.cloneNode(true);
    clone.getElementsByClassName("article__title")[0].innerText =
      response[i].title.rendered;
    clone.getElementsByClassName("article__title")[0].innerText =
      response[i].title.rendered;
    $add.appendChild(clone);
  }
}
