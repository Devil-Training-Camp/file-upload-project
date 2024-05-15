import { createStore } from 'vuex'

export default createStore({
  state: {
    requests: [],
    finish: 0,
  },
  getters: {

  },
  mutations: {
    // 这些 token 明明属于 api service 层的东西，这里耦合进 store 数据管理层。。。这是一个非常不好的设计
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
