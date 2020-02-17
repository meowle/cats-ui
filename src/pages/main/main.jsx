import React from 'react';
import history from '../../utils/history';
import { CatLogo } from '../../common/components/cat-logo';
import css from './main.module.css';
import classNames from 'classnames/bind';
import {
  faSearch,
  faHeart,
  faHeartBroken,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { withRouter, Link } from 'react-router-dom';
import { Icon } from '../../common/components/icon/icon';
import { ValidationsContext } from '../../common/contexts/validations';
import { getErrorValidation } from '../../utils/validation';
import { notify } from '../../utils/notifications/notifications';

class MainPageWithoutRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      some: 2,
    };
    this.style = classNames.bind(css);
  }

  // Template methods

  get isSearchButtonDisabled() {
    return !this.state.searchName;
  }

  get buttons() {
    const className = classNames('button', 'is-light', css.button);
    return (
      <>
        <button
          className={className}
          type="submit"
          disabled={this.isSearchButtonDisabled}
        >
          <Icon icon={faSearch} />
          <span>Найти имя коту</span>
        </button>
        <Link to="/all-names" className={className}>
          <Icon icon={faSearch} />
          <span>Все имена</span>
        </Link>
        <Link to="/top-names" className={className}>
          <Icon icon={faHeart} />
          <span>ТОП-10 имён</span>
        </Link>
        <Link to="/anti-top-names" className={className}>
          <Icon icon={faHeartBroken} />
          <span>АнтиТОП-10 имён</span>
        </Link>
      </>
    );
  }

  onChange = event => {
    const newValue = event.target.value;
    const error = getErrorValidation(newValue, this.context);

    if (error) {
      notify.warning(error);

      return;
    }
    this.setState({ searchName: newValue });
  };

  onSubmit = event => {
    event.preventDefault();

    this._search();
  };

  // Private methods

  _search() {
    if (!this.state.searchName) return;

    history.push(`/search/${this.state.searchName}`);
  }

  render() {
    return (
      <>
        <section className={this.style('section', 'full-size')}>
          <div className={this.style('container', 'full-size')}>
            <div
              className={this.style(
                'columns',
                'is-flex-mobile',
                'is-centered',
                'is-vcentered',
                'full-size'
              )}
            >
              <form onSubmit={this.onSubmit} className="column is-8">
                <div className={this.style('columns', 'is-mobile', 'header')}>
                  <div className="column">
                    <h1
                      className={this.style(
                        'is-size-1-mobile',
                        'is-vbottom-mobile',
                        'title'
                      )}
                    >
                      meowle
                    </h1>
                  </div>
                  <div className="column">
                    <CatLogo size="l"></CatLogo>
                  </div>
                </div>
                <div>
                  <div className="field">
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        placeholder="Введите часть имени"
                        autoComplete="off"
                        disabled={!this.context}
                        value={this.state.searchName}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control has-text-centered">
                      {this.buttons}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        <LinkToAdd />
      </>
    );
  }
}
MainPageWithoutRoute.contextType = ValidationsContext;

export const MainPage = withRouter(MainPageWithoutRoute);

function LinkToAdd() {
  return (
    <Link
      className="button is-light has-background-warning show-add-names"
      to="/cats/add"
      style={{ position: 'absolute', right: '20px', bottom: '20px' }}
    >
      <Icon icon={faPlus} />
    </Link>
  );
}
