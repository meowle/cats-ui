import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactionApi } from '../../../../api/reaction';
import { storage } from '../../../../utils/storage';
import { notify } from '../../../../utils/notifications/notifications';
import styles from './reaction-button.module.css';

const emojiMap = {
  like: '👍',
  dislike: '👎',
};
const titleMap = {
  like: 'Лайкнуть',
  dislike: 'Убрать лайк',
};
const countField = {
  like: 'likes',
  dislike: 'dislikes',
};

export function ReactionButton({ catInfo, type = 'like', updateCatInfo }) {
  const storageMethod = {
    like: storage.likes,
    dislike: storage.dislikes,
  }[type];
  const [isReacted, updateReacted] = useState(storageMethod.exist(catInfo.id));
  const [isLoading, setLoading] = useState(false);
  const styleReacted =
    isReacted && !isLoading ? styles['is-reacted'] : 'is-light';

  const onClick = () => {
    setLoading(true);
    sendReaction(type, catInfo, isReacted)
      .then(() => {
        const storMethod = [storageMethod.set, storageMethod.remove][
          Number(isReacted)
        ];

        storMethod(catInfo.id);
        updateReacted(!isReacted);
        updateCatInfo({
          [countField[type]]: catInfo[countField[type]] + (isReacted ? -1 : 1),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <button
      className={classNames('button', styles['reaction-button'], styleReacted, {
        'is-loading': isLoading,
      })}
      type="button"
      title={titleMap[type]}
      onClick={onClick}
    >
      {emojiMap[type]}&nbsp;<span>{catInfo[countField[type]]}</span>
    </button>
  );
}
ReactionButton.propTypes = {
  catInfo: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['like', 'dislike']).isRequired,
  updateCatInfo: PropTypes.func.isRequired,
};

function sendReaction(type, catInfo, isReacted) {
  const apiMethod = {
    like: [ReactionApi.like, ReactionApi.removeLike],
    dislike: [ReactionApi.dislike, ReactionApi.removeDislike],
  }[type][isReacted ? 1 : 0];

  return apiMethod(catInfo.id).catch(message => {
    notify.error(message);
  });
}
