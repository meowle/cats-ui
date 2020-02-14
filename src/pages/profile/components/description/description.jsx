import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const descriptionInfoPropTypes = {
  catId: PropTypes.number.isRequired,
  text: PropTypes.string,
};

export function Description({ catId, text }) {
  return <Text text={text} catId={catId} />;
}
Description.propTypes = descriptionInfoPropTypes;

function Text({ catId, text }) {
  const emptyText = 'У этого кота нет описания';
  const buttonTitle = (text ? 'Изменить' : 'Добавить') + ' описание';
  const linkTo = `/cats/${catId}/edit`;

  return (
    <>
      <div>{text || emptyText}</div>
      <br />
      <Link to={linkTo} className="button is-info is-outlined">
        {buttonTitle}
      </Link>
    </>
  );
}
Text.propTypes = descriptionInfoPropTypes;

function Form({ catId, text }) {
  return (
    <form onSubmit={onSubmitForm}>
      <textarea
        name="textControl"
        className="textarea"
        placeholder="Введите описание кота"
      >
        {text}
      </textarea>
      <br />
      <button className="button is-success is-outlined">
        Сохранить описание
      </button>
    </form>
  );
}
Form.propTypes = descriptionInfoPropTypes;

function onSubmitForm(event) {
  event.preventDefault();
}
