import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../common/components/header';
import { CatsList } from '../../common/components/cats-list';
import history from '../../utils/history';

export function SearchPage() {
  const { query } = useParams();

  return (
    <>
      <Header searchValue={query} onSearch={onSearch}></Header>
      <CatsList searchValue={query}></CatsList>
    </>
  );
}

function onSearch(query) {
  history.push(`/search/${query}`);
}
