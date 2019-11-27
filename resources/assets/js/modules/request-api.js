// API
export default function requestApi(url) {
  let $body = document.getElementById("body");
  $body.classList.add("loading");

  return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        $body.classList.remove("loading");
        resolve(this);
      }
    };
    xhr.responseType = "json";
    xhr.open("GET", url, true);
    xhr.send();
  });
}
