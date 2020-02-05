export const urls =
  process.env.NODE_ENV === 'production'
    ? {
        catsApi: 'http://meowle.testops.ru:3001',
      }
    : {
        catsApi: 'http://localhost:3001',
      }
