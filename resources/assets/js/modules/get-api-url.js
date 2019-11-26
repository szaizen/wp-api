export default function getApiUrl(currentData) {
  let apiUrlParam = "";

  if (currentData.type === "category") {
    // カテゴリーで絞る
    apiUrlParam += "&categories=" + currentData.cateogyrId;
  }

  if (currentData.type === "search") {
    // 検索ワードで絞る
    apiUrlParam += "&search=" + currentData.searchText;
  }

  apiUrlParam += "&page=" + currentData.page;

  return apiUrlParam;
}
