<template>
    <div class="root-div">
        <input type="text" name="topic" v-model="new_topic_name" /> <br/>
        <input type="submit" value="subscribe" v-on:click="NewSubscribe" />
        <br/><br/>
        <h3> Subscribed Topics </h3>
        <div v-for="(topic, index) in this.$SubTopics.list" :key="index">
            {{topic}}
        </div>
    </div>
</template>

<script>
import Paho from "paho-mqtt"
export default {
    name: 'Topics',
    data() {
        return {
            new_topic_name: ""
        }
    },
    methods: {
        NewSubscribe: function() {
            
            this.$client.obj.subscribe(this.new_topic_name, {qos: 2});
            this.$SubTopics.list.push(this.new_topic_name);
            this.new_topic_name = "";
            //console.log("Subscribed to " + this.new_topic_name);
        }
    }
}
</script>

<style scoped>

</style>
