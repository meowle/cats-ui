import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CatsApi } from '../../../../api/cats';
import history from '../../../../utils/history';

export function Description({
  catId,
  text,
  isEdit = false,
  onChangeDescription,
}) {
  return isEdit ? (
    <Form catId={catId} text={text} onChangeDescription={onChangeDescription} />
  ) : (
    <Text catId={catId} text={text} />
  );
}
Description.propTypes = {
  catId: PropTypes.number.isRequired,
  text: PropTypes.string,
  isEdit: PropTypes.bool,
  onChangeDescription: PropTypes.func,
};

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
Text.propTypes = {
  catId: PropTypes.number.isRequired,
  text: PropTypes.string,
};

function Form({ catId, text, onChangeDescription }) {
  return (
    <form onSubmit={onSubmitForm.bind(null, catId, onChangeDescription)}>
      <textarea
        name="textControl"
        className="textarea"
        placeholder="Введите описание кота"
        defaultValue={text}
      ></textarea>
      <br />
      <button className="button is-success is-outlined">
        Сохранить описание
      </button>
    </form>
  );
}
Form.propTypes = {
  catId: PropTypes.number.isRequired,
  text: PropTypes.string,
  onChangeDescription: PropTypes.func,
};

function onSubmitForm(catId, onChangeDescription, event) {
  event.preventDefault();

  const newDescription = event.target.textControl.value;

  onChangeDescription && onChangeDescription(newDescription);

  CatsApi.saveDescription(catId, newDescription).then(() => {
    history.push(`/cats/${catId}`);
  });
}
