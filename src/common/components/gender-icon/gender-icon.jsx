import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVenus,
  faMars,
  faVenusMars,
} from '@fortawesome/free-solid-svg-icons';

export function GenderIcon(prop) {
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
    <span className={`icon has-text-${styleMap[prop.gender]}`}>
      <FontAwesomeIcon icon={iconMap[prop.gender]} />
    </span>
  );
}
