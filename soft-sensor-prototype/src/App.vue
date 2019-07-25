<template>
  <div id="app">
    <HelloWorld msg="Welcome to Soft-Sensor Prototype"/>
    <div id="main-grid">
      <div class="main-grid-cols"> <h3>Platform Connection</h3> <connection/> </div>
      <div class="main-grid-cols"> <h3>Subscribed Topics</h3> </div>
      <div class="main-grid-cols"> <h3>Send Messages</h3> </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Connection from './components/Connection.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    Connection
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#main-grid {
  display: grid;
  grid-template-columns: 33% 33% 33%;
}

.main-grid-cols {
  border: solid black 2px;
}

.root-div {
  text-align: left;
  margin-left: 40px;
}
</style>
