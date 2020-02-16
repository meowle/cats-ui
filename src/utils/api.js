import axios from 'axios';

export function getApiInstance(baseURL) {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.response.use(
    ({ data }) => data,
    error => {
      const data = error.response.data;
      let message = null;

      message = getBoomError(data);

      return Promise.reject(message);
    }
  );

  return instance;
}

function getBoomError(error) {
  let message = null;

  try {
    message = error.output.payload.message;
  } catch (e) {}

  return message;
}
