import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        stimuli: null,
        isAuthenticated: false,
        userId: null,
        graphData: null,
        cobayeUsers: [],
        selectedUserDetails: null,
    },
    getters: {
        getUser: state => state.user,
        getStimuli: state => state.stimuli,
        getUserId: state => state.userId,
        getGraphData: state => state.graphData,
        getCobayeUsers: state => state.cobayeUsers,
        getSelectedUserDetails: state => state.selectedUserDetails,
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
        setCobayeUsers(state, users) {
            state.cobayeUsers = users;
        },
        setSelectedUserDetails(state, userDetails) {
            state.selectedUserDetails = userDetails;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.userId = null;
            state.graphData = null;
            state.selectedUserDetails = null;
        },
    },
    actions: {
        async initializeStore({ dispatch }) {
            await dispatch('fetchCobayeUsers');
            await dispatch('fetchAllUserGraphs');
        },
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
        async fetchCobayeUsers({ commit }) {
            try {
                const response = await axios.get('/user/cobayes');
                commit('setCobayeUsers', response.data);
            } catch (error) {
                console.error('Error fetching cobaye users:', error);
            }
        },
        async fetchUserGraphs({ commit, state }, userId = state.userId) {
            try {
                const response = await axios.get(`/graphs/user/${userId}`);
                if (response.data && response.data.data) {
                    commit('setGraphs', response.data.data);
                } else {
                    console.log('No graph data returned for user:', userId);
                }
            } catch (error) {
                console.error('Error fetching user graphs:', error);
            }
        },
        async fetchSelectedUserDetails({ commit }, userId) {
            try {
                const response = await axios.get(`/user/details/${userId}`);
                commit('setSelectedUserDetails', response.data);
            } catch (error) {
                console.error('Error fetching selected user details:', error);
            }
        },
        async fetchAllUserGraphs({ state, dispatch }) {
            for (let user of state.cobayeUsers) {
                await dispatch('fetchUserGraphs', user._id);
            }
        },
    },
});
