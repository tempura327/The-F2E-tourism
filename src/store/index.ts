import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: {
      firstName: '',
      lastName: '',
      mail: '',
      avatar: '',
      token: '',
    },
    isModalShow: false,
  },
  mutations: {
    setCurrentUser(state, data: { firstName: string; lastName: string; mail: string; avatar: string; token: string; isLogin: boolean }): void {
      state.currentUser.firstName = data.firstName;
      state.currentUser.lastName = data.lastName;
      state.currentUser.mail = data.mail;
      state.currentUser.avatar = data.avatar;
      state.currentUser.token = data.token;
    },
    toggleModal(state, isModalShow: boolean): void {
      state.isModalShow = isModalShow;
    },
  },
  actions: {},
  modules: {},
});
