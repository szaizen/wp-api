// API
export default function getArticleList(url) {
  let $body = document.getElementById("body");
  $body.classList.add("loading");

  return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        $body.classList.remove("loading");
        resolve({
          response: this.response,
          articleTotal: this.getResponseHeader("x-wp-total"),
          pagesTotal: this.getResponseHeader("x-wp-totalpages")
        });
      }
    };
    xhr.responseType = "json";
    xhr.open("GET", url, true);
    xhr.send();
  });
}
