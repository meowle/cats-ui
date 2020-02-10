export const urls =
  process.env.NODE_ENV === 'production'
    ? {
        catsApi: 'http://bobrovartem.ru/cats/api',
      }
    : {
        catsApi: 'http://localhost:3001',
      };
