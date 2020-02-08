import React from 'react';
import { Link } from 'react-router-dom';

export class Header extends React.Component {
  render() {
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
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input type="text" className="input" />
                </div>
                <div className="control">
                  <button className="button">
                    <span className="icon">
                      <i className="fa fa-search"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
