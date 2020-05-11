export const fetchData = () => {

  const getData = (url) => {
    return fetch(url)
      .then(res => {
        return res.json();
      })
      .catch(err => {
        console.error('err...', err)
      })
  }

  return {getData}
}
