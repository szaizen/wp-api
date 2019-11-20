const url = "https://liginc.co.jp";
const api_url = url + "/wp-json/wp/v2/posts";

requestAjax(api_url, function(response) {
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
  var $template = document.getElementsByClassName("template")[0];
  var $add = document.getElementsByClassName("add")[0];

  for (var i = 0; i < 10; i++) {
    let clone = $template.firstElementChild.cloneNode(true);
    clone.getElementsByClassName("article__title")[0].innerText =
      response[i].title.rendered;
    $add.appendChild(clone);
  }
}
