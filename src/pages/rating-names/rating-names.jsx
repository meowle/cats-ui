import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '../../common/components/header';
import { ValidationsContext } from '../../common/contexts/validations';
import { CatLogo } from '../../common/components/cat-logo';

const titles = {
  top: 'ТОП-10 имён котиков',
  antiTop: 'АнтиТОП-10 имён котиков',
};

export function RatingNamesPage({ type }) {
  return (
    <>
      <ValidationsContext.Consumer>
        {validations => <Header validations={validations}></Header>}
      </ValidationsContext.Consumer>
      <NamesList type={type} />
    </>
  );
}
RatingNamesPage.propTypes = {
  type: PropTypes.oneOf(['top', 'antiTop']).isRequired,
};

function NamesList(type) {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-2">
            <CatLogo class="is-hidden-mobile" />
          </div>
          <div className="column">
            <div className="title is-3">{titles[type]}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
