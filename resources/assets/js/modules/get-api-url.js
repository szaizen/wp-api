export default function getApiUrl(
  currentType,
  currentPage,
  searchText,
  cateogyrId
) {
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

  return apiUrlParam;
}
