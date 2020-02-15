import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export function Icon({ icon }) {
  return (
    <span className="icon">
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}
Icon.propTypes = {
  icon: PropTypes.any.isRequired,
};
