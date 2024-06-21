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
        selectedUserId: localStorage.getItem('selectedUserId') || null, // Retrieve selectedUserId from localStorage
        averageGraphData: null,
    },
    getters: {
        getUser: state => state.user,
        getStimuli: state => state.stimuli,
        getUserId: state => state.userId,
        getGraphData: state => state.graphData,
        getCobayeUsers: state => state.cobayeUsers,
        getSelectedUserDetails: state => state.selectedUserDetails,
        getAverageGraphData: state => state.averageGraphData,
        getSelectedUserId: state => state.selectedUserId,
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
        setSelectedUserId(state, userId) {
            state.selectedUserId = userId;
            localStorage.setItem('selectedUserId', userId);
        },
        setAverageGraphData(state, data) {
            state.averageGraphData = data;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.userId = null;
            state.graphData = null;
            state.selectedUserDetails = null;
            state.selectedUserId = null;
            localStorage.removeItem('selectedUserId'); // Clear selectedUserId from localStorage
            state.averageGraphData = null;
        },
    },
    actions: {
        async initializeStore({ dispatch, commit, state }) {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                commit('setAuthentication', true);
                await dispatch('fetchCurrentUser');
                await dispatch('fetchCobayeUsers');
                if (state.selectedUserId) {
                    await dispatch('fetchSelectedUserDetails', state.selectedUserId);
                    await dispatch('fetchUserGraphs', state.selectedUserId);
                } else {
                    await dispatch('fetchAllUserGraphs');
                }
            }
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
        async fetchCurrentUser({ commit }) {
            try {
                const response = await axios.get('/api/me');
                commit('setUser', response.data);
            } catch (error) {
                console.error('Error fetching current user data:', error);
                localStorage.removeItem('token');
                commit('clearUser');
            }
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
        async fetchReactAndExecTime({ commit }) {
            try {
                const response = await axios.get('/graphs/time');
                if (response.data && response.data.data) {
                    commit('setAverageGraphData', response.data.data);
                } else {
                    console.log('No average graph data returned');
                }
            } catch (error) {
                console.error('Error fetching average graph data:', error);
            }
        },
    },
});
