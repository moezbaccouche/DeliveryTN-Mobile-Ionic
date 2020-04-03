const baseUrl = "http://192.168.1.3:51044/delivery-app/";

export function getAllCategories() {
  const url = `${baseUrl}categories`;
  return fetch(url)
    .then((response) => response.json)
    .catch((error) => console.error(error));
}
