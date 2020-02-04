import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import MainPage from './pages/main/main'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/test">test</Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
