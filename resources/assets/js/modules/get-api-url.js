import {
  API_URL,
  currentType,
  currentPage,
  searchText,
  cateogyrId
} from "../app.js";

export default function getApiUrl() {
  var apiUrlParam = "";

  if (currentType === "category") {
    // カテゴリーで絞る
    apiUrlParam += "&categories=" + cateogyrId;
  }
  if (currentType === "search") {
    // 検索ワードで絞る
    apiUrlParam += "&search=" + searchText;
  }

  apiUrlParam += "&page=" + currentPage;

  return API_URL + apiUrlParam;
}
