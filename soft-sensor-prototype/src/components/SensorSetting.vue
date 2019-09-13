<template>
    <div>
        <a href="#" v-on:click="OpenSettings(sensor)"> Settings </a>
        <div class="popupbg" v-if="isSettingOpen">
            <div class="sensorSetting popup" > 
                <a class="popupClose" href="#" v-on:click="CloseSettings"> close </a>
                <h1> {{CurrentSettingSensor.SmartObj.ObjectName}}: {{CurrentSettingSensor.SmartObj.ObjectID}}</h1>
                <hr/>
                <b> {{CurrentSettingSensor.SerialID}} </b> <br/> Topic : {{CurrentSettingSensor.ObjectTopic}} 
                <hr/>
                <h3>  Resources  </h3>
                <div v-for="(resource) in CurrentSettingSensor.SmartObj.Resources" :key="resource.ResourceID">
                    <b>{{resource.ResourceID}} : {{resource.ResourceName}}</b> {{resource.ResourceValue}} <small> ({{resource.ResourceType}})</small>
                </div>
                <hr/>

                 <div class="input-form">
                    <div class="form-label">Time Period(seconds):</div> <div><input v-model="CurrentSettingSensor.EmitFreq" class="form-field" type="text" /></div> 
                </div>
                

            </div>
       </div>
    </div>
</template>

<script>

import Paho from "paho-mqtt"
import SmartObject from "../models.js"
export default {
    name: 'SensorSetting',
    data() {
        return {
            CurrentSettingSensor: "",
            isSettingOpen: false,
        }
    },
    props: {
        sensor:''
    },
    mounted() {
    },
    methods: {
        OpenSettings: function(sensor) {
            this.CurrentSettingSensor = sensor;
            this.isSettingOpen = true;
        },
        CloseSettings: function(sensor) {
            this.$store.commit('CHANGE_SENSOR_INFO', {id: this.CurrentSettingSensor.SerialID, new: this.CurrentSettingSensor});
            this.isSettingOpen = false;
            if(this.CurrentSettingSensor.EmitFreq != 0) {
                this.$parent.ChangeIntTime(this.CurrentSettingSensor);
            } else {
                this.$parent.StopInt(this.CurrentSettingSensor);
            }
            
            this.CurrentSettingSensor = "";
        },

    }
}
</script>

<style scoped>

</style>
