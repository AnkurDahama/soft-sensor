import Vue from 'vue'
import App from './App.vue'
import Paho from 'paho-mqtt'
import store from './store'

Vue.use(Paho);

Vue.prototype.$client = {obj: "a"};
Vue.prototype.$CreateClient = function(ser, port, clientId) {
  this.$client.obj = new Paho.Client(ser, port, clientId);
};

// Vue.prototype.$Messages = {msg: [{id:0, message:"dafs"}]};

Vue.prototype.$SubTopics = {list: []};

Vue.config.productionTip = false
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
