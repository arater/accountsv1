import React, { useEffect, useState } from 'react'

const Grid = props => {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRepos = async lang => {
    setLoading(true)

    const repos = await props.fetchInitialData(lang)
    setRepos(repos)
    setLoading(false)
  }

  useEffect(() => {
    // isBrowser rollup bundle replace
    if (typeof window !== 'undefined') {
      setRepos(window.__INITIAL_DATA__)
      delete window.__INITIAL_DATA__
    } else {
      setRepos(props.staticContext.data)
    }
  }, [])

  useEffect(() => {
    fetchRepos(props.match.params.id)
  }, [props.match.params.id])

  if (loading === true) {
    return <p>LOADING</p>
  }

  return (
    <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
      {repos.map(({ name, owner, stargazers_count, html_url }) => (
        <li key={name} style={{ margin: 30 }}>
          <ul>
            <li>
              <a href={html_url}>{name}</a>
            </li>
            <li>@{owner.login}</li>
            <li>{stargazers_count} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default Grid
