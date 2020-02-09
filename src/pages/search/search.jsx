import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../common/components/header';
import { CatsList } from '../../common/components/cats-list';
import style from './search.module.css';
import history from '../../utils/history';

export function SearchPage() {
  const { query } = useParams();

  return (
    <div>
      <div className={style.header}>
        <Header searchValue={query} onSearch={onSearch}></Header>
      </div>
      <CatsList searchValue={query}></CatsList>
    </div>
  );
}

function onSearch(query) {
  history.push(`/search/${query}`);
}
