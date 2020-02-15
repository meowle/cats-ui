import React from 'react';

export function Modal({ title, bodyComponent, onClose }) {
  return (
    <div className="modal is-clipped is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <figure className="image is-64x64 modal-card-title">
            <img src="/img/cat-icon.png" />
          </figure>
        </header>
        <section className="modal-card-body">{bodyComponent}</section>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      />
    </div>
  );
}
