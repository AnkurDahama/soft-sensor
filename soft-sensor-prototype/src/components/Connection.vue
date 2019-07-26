<template>
    <div class="root-div">
        <h2 class="root-heading"> Connect to the Platform </h2>
        <div class="input-form">
            <div class="form-label">Host:</div> <div><input class="form-field" type="text" name="mqtt_host" v-model="host" /></div>
            <div class="form-label">Port:</div> <div><input class="form-field" type="number" name="mqtt_port" v-model="port" /></div>
            <div class="form-label">ClientID:</div> <div><input class="form-field" type="text" name="mqtt_clientid" v-model="clientId" /></div>
            <div class="form-label">Username:</div> <div><input class="form-field" type="text" name="mqtt_username" v-model="username" /></div> 
            <div class="form-label">Password:</div> <div><input class="form-field" type="text" name="mqtt_password" v-model="password" /></div> 

            <div class="form-submit" v-on:click="ConnectToMqtt">Connect</div>
            <!-- <input class="form-submit" type="submit" name="mqtt_submit" v-on:click="ConnectToMqtt" />  -->
            <!-- <div><b v-if="isConnected"> Connected </b></div> -->
        </div>
        

        
    </div>
</template>

<script>
import Paho from "paho-mqtt"
export default {
    name: 'Connection',
    data() {
        return {
            host: "postman.cloudmqtt.com",
            port: 30495,
            clientId: "web_" + parseInt(Math.random() * 100, 10),
            username: "cpqxvzdh",
            password: "f5128TgA2ZlL",
            isConnected: false
        }
    },
    methods: {
        ConnectToMqtt: function() {
            this.$CreateClient(this.host, this.port, this.clientId);
		    this.$client.obj.onConnectionLost = this.onConnectionLost;

            var options = {
                useSSL: true,
                userName: this.username,
                password: this.password,
                onSuccess:this.onConnect
            }


            this.$client.obj.connect(options);
        },
        onConnect: function() {
            console.log("Connected");

            this.$root.$emit('connected');
            
            this.isConnected = true;
        },
        onConnectionLost: function(responseObject) {
            if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
            this.isConnected = false;
            this.$root.$emit('disconnected');
  		    }
        }

        
    }
}
</script>

<style scoped>

</style>
