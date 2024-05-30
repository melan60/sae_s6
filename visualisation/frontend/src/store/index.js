import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
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
            state.isAuthenticated = false;
        },
    },
    actions: {
        async login({commit}, credentials) {
            const response = await axios.post('/api/login', credentials);
            localStorage.setItem('token', response.data.token);
            commit('setUser', response.data.user);
            commit('setAuthentication', true);
            return response.data;
        },
        logout({commit}) {
            localStorage.removeItem('token');
            commit('clearUser');
        },
        async fetchUserGraphs({ commit }, userId) {
            try {
                const response = await axios.get(`/graphs/user/${userId}`);
                commit('setGraphs', response.data);
            } catch (error) {
                console.error('Error fetching user graphs:', error);
            }
        },
    },

});
