import { createStore } from 'vuex'

export default createStore({
  state: {
    requests: [],
    finish: 0,
  },
  getters: {

  },
  mutations: {
    setCancelToken(state: any, cancel: any) {
      state.requests.push(cancel);
    },
    setClearRequests(state: any) {
      state.requests = [];
    },
    addFinish(state: any) {
      state.finish++;
    },
    setFinish(state: any) {
      state.finish = 0;
    },
  },
  actions: {

  },
  modules: {
  }
})
