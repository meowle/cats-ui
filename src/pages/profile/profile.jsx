import React, { useState, useEffect } from 'react';
import { useParams, Switch, Route, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Header } from '../../common/components/header';
import { CatLogo } from '../../common/components/cat-logo';
import { GenderIcon } from '../../common/components/gender-icon';
import { CatsApi } from '../../api/cats';
import { Description } from './components/description';
import { ReactionButton } from './components/reaction-button/reaction-button';
import style from './profile.module.css';

export function ProfilePage() {
  const match = useRouteMatch();
  const { catId } = useParams();
  const [catInfo, updateInfo] = useState(null);

  const updateInfoHandler = newCatInfo =>
    updateInfo({ ...catInfo, ...newCatInfo });

  useEffect(() => {
    loadCatProfile(catId, updateInfo);
  }, [catId]);

  const info = catInfo ? (
    <Info catInfo={catInfo} path={match.path} updateInfo={updateInfoHandler} />
  ) : null;

  return (
    <>
      <Header />
      {info}
    </>
  );
}

function loadCatProfile(id, updateHandler) {
  return CatsApi.getById(id).then(({ cat }) => updateHandler(cat));
}

function Info({ catInfo, path, updateInfo }) {
  const _onChangeDescription = onChangeDescription.bind(null, updateInfo);

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-2">
            <CatLogo />
          </div>
          <div className="column">
            <Switch>
              <Route path={`${path}/edit`}>
                <Title catInfo={catInfo} />
                <Description
                  className="description"
                  catId={catInfo.id}
                  text={catInfo.description}
                  isEdit={true}
                  onChangeDescription={_onChangeDescription}
                />
              </Route>
              <Route path={path}>
                <Title catInfo={catInfo} updateInfo={updateInfo} />
                <Description
                  className="description"
                  catId={catInfo.id}
                  text={catInfo.description}
                />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </section>
  );
}
Info.propTypes = {
  catInfo: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  updateInfo: PropTypes.func.isRequired,
};

function Title({ catInfo, updateInfo }) {
  const likes = updateInfo ? (
    <>
      <ReactionButton
        catInfo={catInfo}
        type="like"
        updateCatInfo={updateInfo}
      />
      <ReactionButton
        catInfo={catInfo}
        type="dislike"
        updateCatInfo={updateInfo}
      />
    </>
  ) : null;
  return (
    <div className={classNames('title', 'is-3', style.title)}>
      Значение имени {catInfo.name}
      &nbsp;
      <GenderIcon gender={catInfo.gender} />
      {likes}
    </div>
  );
}
Title.propTypes = {
  catInfo: PropTypes.object.isRequired,
  updateInfo: PropTypes.func,
};

function onChangeDescription(updateInfoHandler, newDescription) {
  updateInfoHandler({ description: newDescription });
}
