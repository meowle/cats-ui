export const urls =
  process.env.NODE_ENV === 'production'
    ? {
        catsApi: 'http://cats.bobrovartem.ru/api',
      }
    : {
        catsApi: 'http://localhost:3001',
      };
