import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Test from './pages/main/main'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Meowle</h2>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/test">Test</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/test">
                <Test />
              </Route>
              <Route path="/">main</Route>
            </Switch>
          </div>
        </Router>
      </header>
    </div>
  )
}

export default App
