import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { ReactionApi } from '../../api/reaction';
import { notify } from '../../utils/notifications/notifications';
import { Header } from '../../common/components/header';
import { CatLogo } from '../../common/components/cat-logo';
import { Icon } from '../../common/components/icon/icon';
import style from './rating-names.module.css';

const titles = {
  top: 'ТОП-10 имён котиков',
  antiTop: 'АнтиТОП-10 имён котиков',
};
const apiMethods = {
  top: ReactionApi.ratingLikes,
  antiTop: ReactionApi.ratingDislikes,
};
const DEFAULT_ERROR = 'Ошибка загрузки рейтинга';

export function RatingNamesPage({ type }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    apiMethods[type]()
      .then(setItems)
      .catch(message => notify.error(message || DEFAULT_ERROR));
  }, [type]);

  return (
    <>
      <Header />
      <NamesList type={type} items={items} />
    </>
  );
}
RatingNamesPage.propTypes = {
  type: PropTypes.oneOf(['top', 'antiTop']).isRequired,
};

function NamesList({ type, items }) {
  const countField = {
    top: 'likes',
    antiTop: 'dislikes',
  }[type];
  const itemsEl = items.map((item, i) => (
    <Item
      type={type}
      key={i}
      number={i + 1}
      name={item.name}
      count={item[countField]}
    />
  ));
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-2">
            <CatLogo class="is-hidden-mobile" />
          </div>
          <div className="column">
            <div className="title is-3">{titles[type]}</div>
            <table className={style.table}>
              <tbody>{itemsEl}</tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
NamesList.propTypes = {
  type: PropTypes.oneOf(['top', 'antiTop']).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Item({ type, number, name, count }) {
  const icon = {
    top: faThumbsUp,
    antiTop: faThumbsDown,
  }[type];

  return (
    <tr>
      <td className={style['item-numerable']}>{number}</td>
      <td>{name}</td>
      <td className={style['item-count']}>
        <Icon icon={icon} />
        {count}
      </td>
    </tr>
  );
}
Item.propTypes = {
  type: PropTypes.oneOf(['top', 'antiTop']).isRequired,
  number: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};
