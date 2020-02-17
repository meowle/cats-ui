import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../common/components/header';
import { CatsList } from '../../common/components/cats-list';

export function SearchPage() {
  const { query } = useParams();

  return (
    <>
      <Header searchValue={query} />
      <CatsList searchValue={query} />
    </>
  );
}
