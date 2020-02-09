import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import history from '../../../utils/history';

export function Header() {
  const { query } = useParams();
  const [searchQuery, setSearchQuery] = useState(query);
  const [isButtonDisabled, setButtonDisabled] = useState(!searchQuery);

  function onChangeSearch({ target: { value } }) {
    setSearchQuery(value);
    setButtonDisabled(!value);
  }

  function onSearch(event) {
    event.preventDefault();
    history.push(`/search/${searchQuery}`);
  }

  return (
    <section className="section has-background-light">
      <div className="container">
        <div className="columns">
          <div className="column is-2 has-text-right-desktop">
            <h1 className="is-size-3">
              <Link to="/" className="has-text-black">
                meowle
              </Link>
            </h1>
          </div>
          <div className="column">
            <form className="field has-addons" onSubmit={onSearch}>
              <div className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  value={searchQuery}
                  onChange={onChangeSearch}
                />
              </div>
              <div className="control">
                <button className="button" disabled={isButtonDisabled}>
                  <span className="icon">
                    <i className="fa fa-search"></i>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
