import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // { _id: '655f6ac4b7eb21e278e04b34' },
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
    async login({commit}, credentials) {
        const response = await axios.post('/api/login', credentials);
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);

        // Commit the user data to the store
        commit('setUser', response.data.user);
        console.log('login', response.data.user);

        return response.data;
    },
    async fetchUserData({ commit }, nomCobaye) {
      try {
        console.log('fetchUserData', nomCobaye);
        const response = await axios.get(`/api/cobaye/${nomCobaye}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
        commit('setUser', response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  },

  modules: {
  }
})
