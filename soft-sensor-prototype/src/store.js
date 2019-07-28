import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isConnected: false,
        AllSensors: []
    },
    mutations: {
        SET_IS_CONNECTED: (state, is_connected) => {
            state.isConnected = is_connected;
        },
        PUSH_NEW_SENSOR: (state, sensor) => {
            state.AllSensors.push(sensor);
        },
        CHANGE_SENSOR_INFO: (state) => {
            state.AllSensors[0].sensor_name = "changed";
        },
        DELETE_SENSOR: (state) => {
            state.AllSensors.shift();
        }
    },
    plugins: [
        createPersistedState({
          // paths: ['_token', '_user_authenticated', '_userID', 'loadedModels']
          paths: []
        })
      ],
});