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
        CHANGE_SENSOR_INFO: (state,payload) => {
            for(var i=0; i<state.AllSensors.length; i++) {
                if(state.AllSensors[i].sensor_id == payload.id) {
                    state.AllSensors[i] = payload.new;
                    //console.log(payload.new);
                }
              }
            
        },
        SPECIAL_DELETE: (state, index) => {
            state.AllSensors.splice(index, 1);
        },
        DELETE_SENSOR: (state, id) => {

          //  state.AllSensors.shift();
            for(var i=0; i<state.AllSensors.length; i++) {
                if(state.AllSensors[i].sensor_id == id) {
                  state.AllSensors.splice(i, 1);
                }
              }
        }
    },
    plugins: [
        createPersistedState({
          // paths: ['_token', '_user_authenticated', '_userID', 'loadedModels']
          paths: []
        })
      ],
});