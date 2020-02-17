import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import style from './header.module.css';
import history from '../../../utils/history';
import { Icon } from '../icon/icon';
import { getErrorValidation } from '../../../utils/validation';
import { notify } from '../../../utils/notifications/notifications';
import { ValidationsContext } from '../../contexts/validations';

export function Header({ searchValue }) {
  const validations = useContext(ValidationsContext);
  const [searchQuery, setSearchQuery] = useState(searchValue || '');
  const [isButtonDisabled, setButtonDisabled] = useState(!searchQuery);

  function onChangeSearch({ target: { value } }) {
    const error = getErrorValidation(value, validations);

    if (error) {
      notify.warning(error);

      return;
    }

    setSearchQuery(value);
    setButtonDisabled(!value);
  }

  function onSearch(event) {
    event.preventDefault();
    history.push(`/search/${searchQuery}`);
  }

  return (
    <section
      className={classnames('section', 'has-background-light', style.header)}
    >
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
                  <Icon icon={faSearch} />
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
  searchValue: PropTypes.string,
};
