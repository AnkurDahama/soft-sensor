<template>
    <div class="root-div">
        Host: <input type="text" name="mqtt_host" v-model="host" /> <br/>
        Port: <input type="number" name="mqtt_port" v-model="port" /> <br/>
        ClientID: <input type="text" name="mqtt_clientid" v-model="clientId" /> <br/>
        <br/><br/>
        Username: <input type="text" name="mqtt_username" v-model="username" /> <br/>
        Password: <input type="text" name="mqtt_password" v-model="password" /> <br/><br/>

        <input type="submit" name="mqtt_submit" v-on:click="ConnectToMqtt" /> <br/><br/>
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
            password: "f5128TgA2ZlL"
        }
    },
    methods: {
        ConnectToMqtt: function() {
            this.$CreateClient(this.host, this.port, this.clientId);
		    this.$client.obj.onMessageArrived = this.onMessageArrived;
		    this.$client.obj.onConnectionLost = this.onConnectionLost;

            var options = {
                useSSL: true,
                userName: this.username,
                password: this.password,
                onSuccess:this.onConnect
                // onFailure:doFail
            }


            this.$client.obj.connect(options);
        },
        onConnect: function() {
            //this.$client.obj.subscribe(this.$SubTopics.list[0], {qos: 2});
            console.log("Connected");
        },
        onMessageArrived: function(message) {
            console.log("onMessageArrived:"+message.payloadString);
        },
        onConnectionLost: function(responseObject) {
            if (responseObject.errorCode !== 0) {
    		console.log("onConnectionLost:"+responseObject.errorMessage);
  		    }
        }

        
    }
}
</script>

<style scoped>

</style>
