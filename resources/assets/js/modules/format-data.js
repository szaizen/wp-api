// レスポンスデータを整形
export default function formatData(response, categoryList) {
  let date = new Date(response.date);
  date =
    date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();

  const responseCategory = response.categories.map(value => {
    const targetList = categoryList.filter(category => {
      return category.id === value;
    });
    return {
      name: targetList[0].name,
      url: targetList[0].url
    };
  });

  const image = (response._embedded["wp:featuredmedia"] !== undefined) ? response._embedded["wp:featuredmedia"][0].source_url : ''

  return {
    title: response.title.rendered,
    url: response.link,
    image,
    createddate: date,
    categoryList: responseCategory
  };
}
