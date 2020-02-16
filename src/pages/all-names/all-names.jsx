import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../common/components/header';
import { CatsList } from '../../common/components/cats-list';
import { ValidationsContext } from '../../common/contexts/validations';

export function AllNamesPage() {
  const { query } = useParams();

  return (
    <>
      <ValidationsContext.Consumer>
        {validations => (
          <Header searchValue={query} validations={validations}></Header>
        )}
      </ValidationsContext.Consumer>
      <CatsList searchValue={query}></CatsList>
    </>
  );
}
