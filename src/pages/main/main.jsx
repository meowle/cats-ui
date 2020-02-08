import React from 'react';
import history from '../../utils/history';
import './main.css';

export class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      some: 2,
    };
  }

  // Template methods

  get isSearchButtonDisabled() {
    return !this.state.searchName;
  }

  onSearchButtonClick = () => {
    this._search();
  };

  onKeyUp = event => {
    this.setState({ searchName: event.target.value });

    if (event.key === 'Enter') {
      this._search();
    }
  };

  // Private methods

  _search() {
    if (!this.state.searchName) return;

    history.push(`/search/${this.state.searchName}`);
  }

  render() {
    return (
      <section className="section full-size">
        <div className="container full-size">
          <div className="columns is-flex-mobile is-centered is-vcentered full-size">
            <div className="column is-8">
              <div className="columns is-mobile header">
                <div className="column">
                  <h1 className="is-size-1-mobile is-vbottom-mobile">meowle</h1>
                </div>
                <div className="column">
                  <figure className="image is-128x128 is-pulled-right">
                    <img src="/img/cat.png" />
                  </figure>
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
                      onKeyUp={this.onKeyUp}
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control has-text-centered">
                    <button
                      className="button is-light"
                      type="submit"
                      disabled={this.isSearchButtonDisabled}
                      onClick={this.onSearchButtonClick}
                    >
                      <span className="icon">
                        <i className="fa fa-search"></i>
                      </span>
                      <span>Найти имя коту</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
