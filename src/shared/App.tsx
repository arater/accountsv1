import React from 'react'
import { Route, Switch } from 'react-router-dom'

import routes from './routes'
import Navbar from './Navbar'
import NoMatch from './NoMatch'
import Counter from '../components/counter';

const App = props => (
  <>
    <Counter />

    <Navbar />

    <Switch>
      {routes.map(({ path, exact, component: Component, ...rest }) => (
        <Route key={path} path={path} exact={exact} render={props => <Component {...props} {...rest} />} />
      ))}
      <Route render={props => <NoMatch {...props} />} />
    </Switch>
  </>
)

export default App;
