<template>
  <div id="app">
    <HelloWorld msg="Welcome to Soft-Sensor Prototype"/>
    <div v-if="!isConnected" class="popup">
      <connection />
    </div>

    <div v-if="isConnected" id="main-grid">
      <div class="main-grid-cols"> <h3>Topics</h3> <topics /> </div>
      <div class="main-grid-cols"> <h3>Send Messages</h3> <post-message/> </div>
      <div class="main-grid-cols"> <h3>Incoming Messages</h3> <incoming-msg/> </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Connection from './components/Connection.vue'
import PostMessage from './components/PostMessage.vue'
import Topics from './components/Topics.vue'
import IncomingMsg from './components/IncomingMsg.vue'
export default {
  name: 'app',
  components: {
    HelloWorld,
    Connection,
    PostMessage,
    Topics,
    IncomingMsg
  },
  data() {
    return {
      isConnected: false
    }
  },
  mounted() {
        this.$root.$on('connected', ()=> {
            this.isConnected = true;
        });
        this.$root.$on('disconnected', ()=> {
          this.isConnected = false;
        })
    },
}
</script>

<style>
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

.root-div {
  text-align: left;
  /* margin-left: 40px; */
}

.root-heading {
  text-align: center;
}

.popup {
  border: solid black 2px;
  box-shadow: 5px 10px;
  /* width: fit-content; */
  width: 500px;
  padding: 60px 60px 60px 60px;
  margin: 0 auto;
  margin-top: 50px;
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
