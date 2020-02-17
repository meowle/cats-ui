import React, { useEffect, useState } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from './utils/history';
import { MainPage } from './pages/main/main';
import { SearchPage } from './pages/search/search';
import { ProfilePage } from './pages/profile/profile';
import { AllNamesPage } from './pages/all-names/all-names';
import { RatingNamesPage } from './pages/rating-names/rating-names';
import style from './App.module.css';
import { AddPopup } from './common/components/add-popup/add-popup';
import { ValidationsContext } from './common/contexts/validations';
import { CatsApi } from './api/cats';

function App() {
  let [validationsState, setValidationsState] = useState(null);

  useEffect(() => {
    CatsApi.getValidations().then(validations => {
      setValidationsState(validations);
    });
  }, []);

  return (
    <div className={style.App}>
      <ValidationsContext.Provider value={validationsState}>
        <Router history={history}>
          <Switch>
            <Route path="/test">test</Route>
            <Route path="/" exact={true}>
              <MainPage />
            </Route>
            <Route path="/search/:query">
              <SearchPage />
            </Route>
            <Route path="/cats/add/">
              <Route path="/cats/add/" exact={true}>
                <MainPage />
                <AddPopup />
              </Route>
              <Route path="/cats/add/:name">
                <MainPage />
                <AddPopup />
              </Route>
            </Route>
            <Route path="/cats/:catId" component={ProfilePage} />
            <Route path="/all-names">
              <AllNamesPage />
            </Route>
            <Route path="/top-names">
              <RatingNamesPage type="top" />
            </Route>
            <Route path="/anti-top-names">
              <RatingNamesPage type="antiTop" />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
      </ValidationsContext.Provider>
    </div>
  );
}

export default App;
