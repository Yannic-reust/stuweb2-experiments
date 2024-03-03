import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
const store = createStore({
  plugins: [createPersistedState()],
  state: {
    userID: null,
    roomID: null,
  },
  mutations: {
    setRoomID(state, payload) {
      state.roomID = payload;
    },
    setUserID(state, payload) {
      state.userID = payload;
    },
  },
  actions: {
    updateRoom(context, uid) {
      context.commit("setRoomID", uid);
    },
    updateUser(context, uid) {
      context.commit("setUserID", uid);
    },
  },
});

// export the store
export default store;
