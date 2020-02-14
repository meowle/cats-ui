import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVenus,
  faMars,
  faVenusMars,
} from '@fortawesome/free-solid-svg-icons';

export function GenderIcon({ gender }) {
  const iconMap = {
    male: faMars,
    female: faVenus,
    unisex: faVenusMars,
  };
  const styleMap = {
    male: 'info',
    female: 'danger',
    unisex: 'primary',
  };

  return (
    <span className={`icon has-text-${styleMap[gender]}`}>
      <FontAwesomeIcon icon={iconMap[gender]} />
    </span>
  );
}
GenderIcon.propTypes = {
  gender: PropTypes.oneOf(['male', 'female', 'unisex']).isRequired,
};
