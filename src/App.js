import React from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { MainPage } from './pages/main/main'
import history from './utils/history'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path="/test">test</Route>
          <Route path="/" exact={true}>
            <MainPage />
          </Route>
          <Route path="/search/:query">Search page</Route>
          <Route path="*">
            <Redirect to="/"></Redirect>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
