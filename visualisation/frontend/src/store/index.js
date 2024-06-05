import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        stimuli: null,
        isAuthenticated: false,
        userId: null,
        graphData: null,
    },
    getters: {
        getUser: state => state.user,
        getStimuli: state => state.stimuli,
        getUserId: state => state.userId,
        getGraphData: state => state.graphData,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.userId = user._id || user.id;
        },
        setStimuli(state, stimu) {
            state.stimuli = stimu;
        },
        setAuthentication(state, status) {
            state.isAuthenticated = status;
        },
        setGraphs(state, graphData) {
            state.graphData = graphData;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.userId = null;
            state.graphData = null;
        },
    },
    actions: {
        /**
         * Logs the user in and sets the token in local storage
         * @param commit
         * @param credentials
         * @returns {Promise<any>}
         */
        async login({ commit }, credentials) {
            const response = await axios.post('/api/login', credentials);
            localStorage.setItem('token', response.data.token);
            commit('setUser', response.data.user);
            commit('setAuthentication', true);
            return response.data;
        },
        logout({ commit }) {
            localStorage.removeItem('token');
            commit('clearUser');
        },
        /**
         * Fetches the current user's data and graphs
         * @param commit
         * @param state
         * @returns {Promise<void>}
         */
        async fetchUserGraphs({ commit, state }) {
            try {
                const user = state.user;
                const userId = state.userId;
                if (!userId) {
                    console.error("User ID is not defined");
                    return;
                }
                let url = user.typeUser === 'admin' ? '/graphs/time' : `/graphs/user/${userId}`;
                const res = await axios.get(`http://localhost:5000${url}`);
                commit('setGraphs', res.data.data); // Set the graph data
            } catch (error) {
                console.error('Error fetching user graphs:', error);
            }
        },
    },
});
