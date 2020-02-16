import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CatsApi } from '../../../api/cats';
import { CatLogo } from '../cat-logo';
import { GenderIcon } from '../gender-icon';
import style from './cats-list.module.css';

export function CatsList({ searchValue }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setGroups] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    CatsApi.search(searchValue)
      .then(data => {
        setGroups(data);
        setError(null);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchValue]);

  return isLoading ? (
    <></>
  ) : error ? (
    <Error />
  ) : data.count ? (
    <Results data={data} />
  ) : (
    <>
      <NoResults text="Упс! Ничего не нашли" name={searchValue} />
    </>
  );
}
CatsList.propTypes = {
  searchValue: PropTypes.string.isRequired,
};

function Error() {
  return <NoResults text="Ошибка загрузки котов"></NoResults>;
}

function NoResults({ text, name }) {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column">
            <div className="level">
              <div className="level-item">
                <figure className="image is-64x64">
                  <img src="/img/weary-cat.png" alt="" />
                </figure>
              </div>
            </div>
            <div className="control has-text-centered">
              <div className="h2 subtitle">{text}</div>
            </div>
            <br />
            <div className="control has-text-centered">
              <AddCat name={name} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
NoResults.propTypes = {
  text: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function Results(props) {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-2">
            <CatLogo class="is-hidden-mobile" />
          </div>
          <div className="column">
            <Groups groups={props.data.groups} />
          </div>
        </div>
      </div>
    </section>
  );
}
Results.propTypes = {
  data: PropTypes.object.isRequired,
};

function Groups(props) {
  return props.groups.map((group, i) => <Group group={group} key={i} />);
}
Groups.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Group({ group: { title, count, cats } }) {
  return (
    <div className={style.group}>
      <div className={style.groupHeader}>
        <span className="title is-4">{title}</span>
        <span className="is-pulled-right has-text-grey is-size-7">{count}</span>
      </div>
      <div>
        <Cats cats={cats} />
      </div>
    </div>
  );
}
Group.propTypes = {
  group: PropTypes.object.isRequired,
};

function Cats(props) {
  const catsEl = props.cats.map(cat => <Cat cat={cat} key={cat.id} />);

  return <div className="tags">{catsEl}</div>;
}
Cats.propTypes = {
  cats: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Cat({ cat: { id, name, gender } }) {
  const link = `/cats/${id}`;

  return (
    <span className="tag is-size-5">
      <GenderIcon gender={gender} />
      <Link to={link} className="has-text-black">
        {name}
      </Link>
    </span>
  );
}
Cat.propTypes = {
  cat: PropTypes.object.isRequired,
};

function AddCat({ name }) {
  return (
    <Link to={`/cats/add/${name}`} className="button is-warning is-medium">
      <span>Добавить&nbsp;</span>
      <span className="has-text-weight-bold">{name}</span>
      <span>&nbsp;в базу?</span>
    </Link>
  );
}
AddCat.propTypes = {
  name: PropTypes.string.isRequired,
};
