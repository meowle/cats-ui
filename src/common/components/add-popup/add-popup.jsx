import React, { useState } from 'react';
import { Modal } from '../modal';
import history from '../../../utils/history';
import { CatsApi } from '../../../api/cats';
import { Item } from './item';

const newItemData = {
  name: '',
  gender: null,
};

export function AddPopup() {
  return (
    <Modal title="Добавить имена в базу котиков" onClose={onClose}>
      <Form />
    </Modal>
  );
}

function Form() {
  const [items, setItems] = useState([newItemData]);

  return (
    <div className="column">
      <form onSubmit={onSubmit.bind(null, items)}>
        {items.map((state, i) => (
          <Item
            key={i}
            index={i}
            state={state}
            isAdd={i === items.length - 1}
            onChange={onChange.bind(null, items, setItems, i)}
            onAdd={_ => setItems([...items, newItemData])}
            onRemove={onRemove.bind(null, items, setItems, i)}
          />
        ))}
        <button className="button is-warning">Добавить</button>
      </form>
    </div>
  );
}

function onClose() {
  history.push('/');
}

function onRemove(items, setItems, index) {
  const newItems = items.slice();

  newItems.splice(index, 1);

  setItems(newItems);
}

function onChange(items, setItems, index, newState) {
  const newItems = items.slice();

  newItems[index] = newState;
  setItems(newItems);
}

function onSubmit(state, event) {
  event.preventDefault();

  CatsApi.add(state).then(_ => {
    onClose();
  });
}
