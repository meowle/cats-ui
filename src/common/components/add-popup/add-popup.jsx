import React from 'react';
import { Modal } from '../modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export function AddPopup() {
  return <Modal title="Добавить имена в базу котиков" bodyComponent={Form()} />;
}

function Form() {
  return (
    <div className="column">
      <form>
        <div className="level add-cat-data">
          <div className="level-left">
            <div className="level-item">
              <div className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  placeholder="Введите имя"
                  name="cat-name-0"
                />
              </div>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="control">
                <span className="specify-gender">Укажите пол:</span>
                <label className="radio">
                  <input type="radio" name="cat-gender-0" value="female" /> Ж
                </label>
                <label className="radio">
                  <input type="radio" name="cat-gender-0" value="male" /> М
                </label>
                <label className="radio">
                  <input type="radio" name="cat-gender-0" value="unisex" />{' '}
                  Универс.
                </label>
              </div>
              <div className="control">
                <button className="button is-light add-new-name">
                  <span className="icon">
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <button className="button is-warning submit-cats">Добавить</button>
      </form>
    </div>
  );
}
