<template>
    <div class="root-div">
        <div v-for="(message_list) in this.messages" :key="message_list.id">
            <b>{{message_list.message.topic}}</b> : {{message_list.message.payloadString}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'IncomingMsg',
    data() {
        return {
            messages: []
        }
    },
    mounted() {
        this.$client.obj.onMessageArrived = this.onMessageArrived;
    },
    methods: {
        onMessageArrived: function(message) {
            console.log(message);
            var key_len = this.messages.length;
            this.messages.push({id: key_len, message: message});
            console.log(this.messages);
        }
    }
}
</script>

<style scoped>

</style>
 