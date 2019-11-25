// card型で表示するDOM用意
export default function createDom(response) {
  const $template = document.getElementById("js-template");
  const clone = $template.firstElementChild.cloneNode(true);
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

  return clone;
}
