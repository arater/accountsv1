import fetch from 'isomorphic-fetch'

export const fetchPopularRepos = async (language = 'all') => {
  const encodedURI = encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  )

  try {
    const data = await fetch(encodedURI)
    const repos = await data.json()
    return repos.items
  } catch (error) {
    console.warn(error)
    return null
  }
}
