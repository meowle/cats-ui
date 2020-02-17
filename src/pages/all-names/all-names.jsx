import React from 'react';
import { Header } from '../../common/components/header';
import { CatsList } from '../../common/components/cats-list';
import { ValidationsContext } from '../../common/contexts/validations';

export function AllNamesPage() {
  return (
    <>
      <ValidationsContext.Consumer>
        {validations => <Header validations={validations}></Header>}
      </ValidationsContext.Consumer>
      <CatsList></CatsList>
    </>
  );
}
