//import requestApi from "../modules/request-api.js";

export default class Category {
  constructor(response) {
    this.response = response;
  }

  getCategoryList() {
    this.categoryList = this.response.map(el => {
      return { id: el.id, name: el.name, url: el.link };
    });
    return this.categoryList;
  }
}

/*
async function addCategory() {
  let result = await getCategoryList(CATEGORY_URL);
  let category = new Category(result);
  categoryList = category.get();
  addSidebarCategoryList();
}

// サイドバーにカテゴリー一覧表示
function addSidebarCategoryList() {
  let $ul = document.getElementById("js-category-list");
  $ul.innerHTML = categoryList
    .map(item => `<li data-categoryid="${item.id}">${item.name}</li>`)
    .join("");
  $ul.addEventListener("click", e => {
    currentData.cateogyrId = e.target.dataset.categoryid;
    currentData.page = 1;
    currentData.type = "category";
    addCard();
  });
}

*/
