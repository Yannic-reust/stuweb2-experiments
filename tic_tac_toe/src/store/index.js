import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
const store = createStore({
  plugins: [createPersistedState()],
  state: {
    userID: null,
  },
  mutations: {
    setUserID(state, payload) {
      state.userID = payload;
    },
  },
  actions: {
    updateUser(context, uid) {
      context.commit("setUserID", uid);
    },
  },
});

// export the store
export default store;
