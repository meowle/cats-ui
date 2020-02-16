import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../modal';
import history from '../../../utils/history';
import { CatsApi } from '../../../api/cats';
import { Item } from './item';
import { ValidationsContext } from '../../contexts/validations';
import { getErrorValidation } from '../../../utils/validation';
import { notify } from '../../../utils/notifications/notifications';
import { useParams } from 'react-router-dom';

const newItemData = {
  name: '',
  gender: null,
};

export function AddPopup() {
  return (
    <Modal title="Добавить имена в базу котиков" onClose={onClose}>
      <ValidationsContext.Consumer>
        {validations => <Form validations={validations} />}
      </ValidationsContext.Consumer>
    </Modal>
  );
}

function Form({ validations }) {
  const { name } = useParams() || '';

  const [items, setItems] = useState([{ ...newItemData, name }]);

  return (
    <div className="column">
      <form onSubmit={onSubmit.bind(null, items)}>
        {items.map((state, i) => (
          <Item
            key={i}
            index={i}
            state={state}
            isAdd={i === items.length - 1}
            onChange={onChange.bind(null, items, setItems, i, validations)}
            onAdd={_ => setItems([...items, newItemData])}
            onRemove={onRemove.bind(null, items, setItems, i)}
          />
        ))}
        <button className="button is-warning">Добавить</button>
      </form>
    </div>
  );
}
Form.propTypes = {
  validations: PropTypes.arrayOf(PropTypes.object),
};

function onClose() {
  history.push('/');
}

function onRemove(items, setItems, index) {
  const newItems = items.slice();

  newItems.splice(index, 1);

  setItems(newItems);
}

function onChange(items, setItems, index, validations, newState) {
  const error = getErrorValidation(newState.name, validations);

  if (error) {
    notify.warning(error);
    return;
  }

  const newItems = items.slice();

  newItems[index] = newState;
  setItems(newItems);
}

function onSubmit(state, event) {
  event.preventDefault();

  if (!isValidState(state)) {
    notify.warning('Заполните всю форму');
    return;
  }

  CatsApi.add(state)
    .then(_ => {
      onClose();
    })
    .catch(message => {
      notify.error(message || 'Что-то пошло не так');
    });
}

function isValidState(state) {
  return state.every(item => item.name && item.gender);
}
