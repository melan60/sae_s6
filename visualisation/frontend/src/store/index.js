import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // { _id: '656853171475ca3c16ad187c' },
    stimuli: null
  },
  getters: {
    getUser: state => state.user,
    getStimuli: state => state.stimuli
  },
  mutations: {
    setUser: function (state, user) {
      state.user = user;
    },
    setStimuli: function (state, stimu) {
      state.stimuli = stimu
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await axios.post('/api/login', credentials);
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Commit the user data to the store
      commit('setUser', response.data.user);
      console.log('login', response.data.user);

      return response.data;
    }
  }
});
