import Home from './Home'
import Grid from './Grid'
import SearchLog from '../components/SearchLog'

import { fetchPopularRepos } from './api'

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/logs',
    exact: true,
    component: SearchLog
    
  },
  {
    path: '/popular/:id',
    component: Grid,
    fetchInitialData: (path = '') => fetchPopularRepos(path.split('/').pop())
  }
]

export default routes
