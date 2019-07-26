import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isConnected: false
    },
    mutations: {
        SET_IS_CONNECTED: (state, is_connected) => {
            state.isConnected = is_connected;
        }
    }
});