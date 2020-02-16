import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../common/components/header';
import { CatsList } from '../../common/components/cats-list';
import { notify } from '../../utils/notifications/notifications';

export function SearchPage() {
  const { query } = useParams();

  notify.info('sad', null);
  notify.success('sad', null);
  notify.warning('sad', null);
  notify.error('sad', null);

  return (
    <>
      <Header searchValue={query}></Header>
      <CatsList searchValue={query}></CatsList>
    </>
  );
}
