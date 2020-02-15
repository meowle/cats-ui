import React from 'react';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../icon/icon';
import styles from './item.module.css';

export function Item({ index, isAdd, state, onChange, onAdd, onRemove }) {
  const buttonAction = (
    <button
      type="button"
      className="button is-light"
      onClick={isAdd ? onAdd : onRemove}
    >
      <Icon icon={isAdd ? faPlus : faMinus} />
    </button>
  );

  return (
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <div className={classNames('control', 'is-expanded', styles.name)}>
            <input
              className="input"
              type="text"
              value={state.name}
              onChange={event =>
                onChange({ ...state, name: event.target.value })
              }
              placeholder="Введите имя"
            />
          </div>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <div className="control">
            <span
              className={classNames('specify-gender', styles['gender-label'])}
            >
              Укажите пол:
            </span>
            <GenderInput
              gender="female"
              index={index}
              state={state}
              onChange={onChange}
            />
            <GenderInput
              gender="male"
              index={index}
              state={state}
              onChange={onChange}
            />
            <GenderInput
              gender="unisex"
              index={index}
              state={state}
              onChange={onChange}
            />
          </div>
          <div className={classNames('control', styles['button-add-remove'])}>
            {buttonAction}
          </div>
        </div>
      </div>
    </div>
  );
}
Item.propTypes = {
  index: PropTypes.number.isRequired,
  isAdd: PropTypes.bool.isRequired,
  state: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

function GenderInput({ gender, index, state, onChange }) {
  const genderTitleMap = {
    male: 'М',
    female: 'Ж',
    unisex: 'Универс.',
  };

  return (
    <label className="radio">
      <input
        type="radio"
        name={`gender-${index}`}
        value={gender}
        checked={state.gender === gender}
        onChange={_ =>
          onChange({
            ...state,
            gender,
          })
        }
      />
      {' ' + genderTitleMap[gender]}
    </label>
  );
}
GenderInput.propTypes = {
  gender: PropTypes.oneOf(['male', 'female', 'unisex']),
  index: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
