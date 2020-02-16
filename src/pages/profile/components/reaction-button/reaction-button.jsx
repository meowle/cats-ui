import React from 'react';
import PropTypes from 'prop-types';
import { CatsApi } from '../../../../api/cats';

const emojiMap = {
  like: '👍',
  dislike: '👎',
};
const titleMap = {
  like: 'Лайкнуть',
  dislike: 'Убрать лайк',
};

export function ReactionButton({
  catId,
  isDisabled,
  type = 'like',
  count = 0,
}) {
  return (
    <button
      class="button is-light"
      type="button"
      title={titleMap[type]}
      onClick={onClick.bind(tpe)}
    >
      {emojiMap[type]}&nbsp;<span>{count}</span>
    </button>
  );
}
ReactionButton.propTypes = {
  catId: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool,
  type: PropTypes.oneOf(['like', 'dislike']).isRequired,
  count: PropTypes.number.isRequired,
};

function onClick(type) {}
