import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export function Header({ searchValue, onSearch: onSearchHandler }) {
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [isButtonDisabled, setButtonDisabled] = useState(!searchQuery);

  function onChangeSearch({ target: { value } }) {
    setSearchQuery(value);
    setButtonDisabled(!value);
  }

  function onSearch(event) {
    event.preventDefault();
    onSearchHandler(searchQuery);
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
                    <FontAwesomeIcon icon={faSearch} />
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
Header.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};
