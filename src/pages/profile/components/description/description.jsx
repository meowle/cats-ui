import React from 'react';
import { Link } from 'react-router-dom';

export function Description({ catId, description }) {
  return <Text description={description} catId={catId} />;
}

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

function Form({ id, text }) {
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

function onSubmitForm(event) {
  event.preventDefault();
}
