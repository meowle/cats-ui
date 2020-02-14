import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../common/components/header';
import { CatLogo } from '../../common/components/cat-logo';
import { GenderIcon } from '../../common/components/gender-icon';
import { CatsApi } from '../../api/cats';

export function ProfilePage() {
  const { id } = useParams();
  const [catInfo, updateInfo] = useState(null);

  useEffect(() => {
    loadCatProfile(id, updateInfo);
  }, [id]);

  const info = catInfo ? <Info catInfo={catInfo} /> : <div></div>;
  console.log(catInfo);
  return (
    <>
      <Header />
      {info}
    </>
  );
}

function loadCatProfile(id, updateHandler) {
  return CatsApi.getById(id).then(({ data }) => updateHandler(data.cat));
}

function Info({ catInfo }) {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-2">
            <CatLogo />
          </div>
          <div className="column">
            <span className="title is-3">
              Значение имени {catInfo.name}
              &nbsp;
              <GenderIcon gender={catInfo.gender} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
