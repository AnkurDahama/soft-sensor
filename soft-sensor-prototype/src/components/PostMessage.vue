<template>
    <div class="root-div">
        Topic: <input type="text" v-model="topic" /> <br/><br/>
        Message: <textarea v-model="message" /> <br/>
        <br/>
        <input type="submit" v-on:click="SendMessage" />

    </div>
</template>

<script>
import Paho from "paho-mqtt"
export default {
    name: 'PostMessage',
    data() {
        return {
            topic: "testtopic/1",
            message: ""
        }
    },
    methods: {
        SendMessage: function() {
            var message = new Paho.Message(this.message);
            message.destinationName = this.topic;
            this.$client.obj.send(message);
            this.message = "";
        }
    }
}
</script>

<style scoped>

</style>

