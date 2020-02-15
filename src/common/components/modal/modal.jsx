import React from 'react';
import PropTypes from 'prop-types';
import { CatLogo } from '../../../common/components/cat-logo';

export function Modal({ title, children, onClose }) {
  return (
    <div className="modal is-clipped is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <CatLogo
            catType="modal"
            isRight={false}
            styles={['modal-card-title']}
          />
        </header>
        <section className="modal-card-body">{children}</section>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={() => onClose()}
      />
    </div>
  );
}
Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
