import Vue from 'vue'
import App from './App.vue'
import Paho from 'paho-mqtt'

Vue.use(Paho);
Vue.prototype.$client = "s";
Vue.prototype.$CreateClient = function(ser, port, clientId) {
  this.$client = new Paho.Client(ser, port, clientId);
};

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
