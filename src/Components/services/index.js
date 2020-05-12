const baseUrl = 'https://api.themoviedb.org/3/search/movie?api_key=08aaaa1b47117c8f992f62718220f428&language=en-US'

export const fetchData = () => {

  const getData = (url) => {
    return fetch(`${baseUrl}${url}`)
      .then(res => {
        return res.json();
      })
      .catch(err => {
        console.error('err...', err)
      })
  }

  return {getData}
}
