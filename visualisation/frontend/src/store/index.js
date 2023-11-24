import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stimuli: null
  },
  getters: {
    getStimuli: state => state.stimuli
  },
  mutations: {
    setStimuli: function (state, stimu) {
      state.stimuli = stimu

    }
  },
  actions: {
  },
  modules: {
  }
})
