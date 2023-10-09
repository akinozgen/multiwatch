export default {
  loadState: (key) => {
    try {
      const serializedState = localStorage.getItem(key);
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch(e) {
      return undefined;
    }
  },

  saveState: (key, state) => {
    const serializedState = JSON.stringify(state);

    try {
      localStorage.setItem(key, serializedState);
    } catch(e) {
      // Ignore write errors.
    }
  },

  clearState: (key) => {
    try {
      localStorage.removeItem(key);
    } catch(e) {
      // Ignore write errors.
    }
  }
}