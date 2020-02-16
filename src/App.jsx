import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from './utils/history';
import { MainPage } from './pages/main/main';
import { SearchPage } from './pages/search/search';
import { ProfilePage } from './pages/profile/profile';
import style from './App.module.css';
import { AddPopup } from './common/components/add-popup/add-popup';

function App() {
  return (
    <div className={style.App}>
      <Router history={history}>
        <Switch>
          <Route path="/test">test</Route>
          <Route path="/" exact={true}>
            <MainPage />
          </Route>
          <Route path="/search/:query">
            <SearchPage />
          </Route>
          <Route path="/cats/add">
            <MainPage />
            <AddPopup />
          </Route>
          <Route path="/cats/:catId" component={ProfilePage} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
