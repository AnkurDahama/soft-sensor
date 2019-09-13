<template>
  <div id="app">
    <HelloWorld msg="Welcome to Soft-Sensor Prototype"/>
    <div v-if="!isConnected" class="popup">
      <connection />
    </div>

    <div v-if="isConnected">
      <sensor-list />
    </div>

  </div>
</template>

<script>
import Paho from 'paho-mqtt'
import HelloWorld from './components/HelloWorld.vue'
import Connection from './components/Connection.vue'
import PostMessage from './components/PostMessage.vue'
import Topics from './components/Topics.vue'
import IncomingMsg from './components/IncomingMsg.vue'
import SensorList from './components/SensorList.vue'
import DataGenerator from './generator.js'
export default {
  name: 'app',
  components: {
    HelloWorld,
    Connection,
    PostMessage,
    Topics,
    IncomingMsg,
    SensorList
  },
  data() {
    return {
      isConnected: false,
      Generator: new DataGenerator(1)
    }
  },
  mounted() {
        this.$root.$on('connected', ()=> {
            this.isConnected = true;
        });
        this.$root.$on('disconnected', ()=> {
          this.isConnected = false;
        });
        this.$root.$on('send_signal', (id)=> {
          // Find index by ID
          var sensor = this.FindSensorBySensorID(id);
          this.Generator.GenerateForSensor(sensor);
          this.SendMessage(JSON.stringify(sensor), sensor.ObjectTopic);
          setTimeout(function() {this.$root.$emit('signal_sent', id)}.bind(this),200);
          //this.$root.$emit('signal_sent');          
        })
    },
    methods: {
      FindSensorBySensorID: function(id) {
        for(var i=0; i<this.$store.state.AllSensors.length; i++) {
          if(this.$store.state.AllSensors[i].SerialID == id) {
            return this.$store.state.AllSensors[i];
          }
        }
      },
      SendMessage: function(payload, dest) {
            var message = new Paho.Message(payload);
            message.destinationName = dest;
            this.$client.obj.send(message);
        }
    }
}
</script>

<style>
a {
  text-decoration: none;
  color: #1c2630;
}
a:visited {
  color: #1c2630;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
#main-grid {
  display: grid;
  grid-template-columns: 33% 33% 33%;
  /* margin: 0 auto; */
}
.main-grid-cols {
  border: solid black 2px;
}
.root-page-div {
  text-align: left;
  margin-left: 40px;
}
.root-div {
  text-align: left;
  /* margin-left: 40px; */
}
.root-heading {
  text-align: center;
}
/* .popup {
  border: solid black 2px;
  box-shadow: 5px 10px;
  width: 500px;
  padding: 60px 60px 60px 60px;
  margin: 0 auto;
  margin-top: 50px;
} */
.popupbg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 900;
  background-color: rgba(255, 255, 255, 0.5);
}
.popup {
  z-index: 999;
  background-color: #fff;
  width: 50%;
  position: fixed;
  top: 20%;
  left: 25%;
  border: solid black 2px;
  box-shadow: 5px 10px;
  width: 500px;
  padding: 30px 60px 30px 60px;
  
  /* margin-top: 50px; */
}
.popupClose {
  position: absolute;
  right: 15px;
  top: 10px;
  font-weight: bold;
}
.input-form {
  display: grid;
  grid-template-columns: 30% 70%;
  row-gap: 10px;
  column-gap: 40px;
}
.form-field {
  font-size: 1.1em;
  width: 70%;
  height: 40px;
}
.form-label {
  margin-top: 10px;
  text-align: right;
}
.form-submit {
  border: 2px solid #2c3e50;
  padding: 10px 50px;
  text-align: center;
  grid-column: 1/-1;
  margin: 0 auto;
  margin-top: 20px;
}
.form-submit:active {
  background-color: #2c3e50;
}
.form-submit:hover {
  cursor: pointer;
}
</style>