import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // { _id: '655f6ac4b7eb21e278e04b34' },
    stimuli: null,
    isAuthenticated: false,
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
    },
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false; // Update authentication state
    },
  },
  actions: {
    async login({commit}, credentials) {
        const response = await axios.post('/api/login', credentials);
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);

        // Commit the user data to the store
        commit('setUser', response.data.user);
        commit('setAuthentication', true);
        console.log('login', response.data.user);

        return response.data;
    },
    logout({ commit }) {
      localStorage.removeItem('token'); // Clear token from local storage
      commit('clearUser'); // Clear user data from state
    },
  },

  modules: {
  }
})
