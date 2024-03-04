import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
const store = createStore({
  //plugins: [createPersistedState()],
  plugins: [],
  state: {
    userID: null,
    roomID: null,
    player: null,
    waiting: true,
  },
  mutations: {
    setRoomID(state, payload) {
      state.roomID = payload;
    },
    setUserID(state, payload) {
      state.userID = payload;
    },
    setPlayer(state, payload) {
      state.player = payload;
    },
    setWaiting(state, payload) {
      state.waiting = payload;

    },
  },
  actions: {
    updateRoom(context, uid) {
      context.commit("setRoomID", uid);
    },
    updateUser(context, uid) {
      context.commit("setUserID", uid);
    },
    updatePlayer(context, id) {
      context.commit("setPlayer", id);
    },
    updateWaiting(context, bool) {
      context.commit("setWaiting", bool);
    },
  },
});

// export the store
export default store;
