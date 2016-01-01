import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, IndexRoute, Redirect } from 'react-router'
import {
  App,
  Landing,
  Display,
  Gamepad
} from './containers'
import createBrowserHistory from 'history/lib/createBrowserHistory'

const router = (
  <Router>
    <Route path='/' component={App}>
      <IndexRoute component={Landing} />

      <Route path='display' component={Display} />
      <Route path='gamepad' component={Gamepad} />
    </Route>
  </Router>
)

export default router
