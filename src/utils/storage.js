export const storage = {
  likes: {
    exist(catId) {
      return Boolean((getFromStor('likes') || {})[catId]);
    },
    set(catId) {
      setIntoStor('likes', catId, true);
    },
    remove(catId) {
      removeFromStor('likes', catId);
    },
  },
  dislikes: {
    exist(catId) {
      return Boolean((getFromStor('dislikes') || {})[catId]);
    },
    set(catId) {
      setIntoStor('dislikes', catId, true);
    },
    remove(catId) {
      removeFromStor('dislikes', catId);
    },
  },
};

function getFromStor(key) {
  let result = null;

  try {
    result = JSON.parse(window.localStorage.getItem(key));
  } catch (e) {}

  return result;
}

function setIntoStor(key, catId, value) {
  const stor = getFromStor(key) || {};

  stor[catId] = value;

  window.localStorage.setItem(key, JSON.stringify(stor));
}

function removeFromStor(key, catId) {
  const stor = getFromStor(key) || {};

  delete stor[catId];

  window.localStorage.setItem(key, JSON.stringify(stor));
}
