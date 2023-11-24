import Vue from 'vue'
import Vuex from 'vuex'

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
  },
  modules: {
  }
})
