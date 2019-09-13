<template>
    <div class="root-page-div">
        
        <h2> All Sensors <small>  </small> </h2> <add-sensor> </add-sensor> <br/>
        <b> All Active Sensors </b><br/>

        <div id="sensor-grid">
            <div class="sensor-small" v-for="(sensor) in this.$store.state.AllSensors" :key="sensor.SerialID" :id="sensor.SerialID">
                <b> {{sensor.SmartObj.ObjectID}}  -  {{sensor.SmartObj.ObjectName}} </b><br/><br/>
                <div id="sensor-options">
                    <a v-if="sensor.EmitFreq==0" href="#" v-on:click="SendSignal(sensor.SerialID)"> Send Signal </a> 
                    <a v-if="sensor.EmitFreq!=0&&intervals.find(intv=>intv.sensorid == sensor.SerialID)&&intervals.find(intv=>intv.sensorid == sensor.SerialID).isactive==true" href="#" v-on:click="StopInt(sensor)"> Pause Emitting </a>
                    <a v-if="sensor.EmitFreq!=0&&intervals.find(intv=>intv.sensorid == sensor.SerialID)&&intervals.find(intv=>intv.sensorid == sensor.SerialID).isactive==false" href="#" v-on:click="ChangeIntTime(sensor)"> Resume Emitting </a><br/><br/> 

                    <sensor-setting v-bind:sensor="sensor"></sensor-setting><br/>
                    <data-gen-component v-bind:sensor="sensor"> </data-gen-component><br/>
                    <a href="#" v-on:click="DeleteSensor(sensor.SerialID)"> Delete </a>

                </div>
            </div>
        </div>

    </div>
</template>

<script>

import SmartObject from "../models.js"
import DataGenerator from "../generator.js" 
import { setInterval } from 'timers';
import AddSensor from './AddSensor.vue'
import SensorSetting from './SensorSetting.vue'
import DataGenComponent from './DataGenComponent.vue'
export default {
    name: 'SensorList',
    components: {
        AddSensor,
        SensorSetting,
        DataGenComponent
    },
    data() {
        return {
            intervals: [],
        }
    },
    mounted() {
        // this.$store.commit('SPECIAL_DELETE', 0);

        
         this.$root.$on('signal_sent', (id) => {
            // Turn the background back to normal
            document.getElementById(id).classList.remove("sensorHot");
        });
        // Signal Emitter
        for(var i=0; i<this.$store.state.AllSensors.length; i++) {
            this.StartInt(this.$store.state.AllSensors[i]);
        }
    },
    methods: {
        StartInt: function(sensor) {
            if(sensor.EmitFreq > 0) {
                this.intervals.push({sensorid:sensor.SerialID, interval:setInterval(() => this.SendSignal(sensor.SerialID), sensor.EmitFreq*1000), isactive:true });
            }
        },
        StopInt: function(sensor) {
            var ThisInt = this.intervals.find(intv=> intv.sensorid == sensor.SerialID);
            if(ThisInt) {
                clearInterval(ThisInt.interval._id);
                ThisInt.isactive = false;
            // ThisInt.sensorid = -1;
            }
            
        },
        ChangeIntTime: function(sensor) {
            var ThisInt = this.intervals.find(intv=> intv.sensorid == sensor.SerialID);
            if(ThisInt==undefined) {
                this.StartInt(sensor);
            } else {
                clearInterval(ThisInt.interval._id);
            ThisInt.sensorid = -1;
            this.StartInt(sensor);
            }
            
        },
        SendSignal: function(id) {
            document.getElementById(id).classList.add("sensorHot");
            this.$root.$emit('send_signal', id);
        },
        DeleteSensor: function(id) {
            this.$store.commit('DELETE_SENSOR', id);
        },





  
    }
}
</script>

<style scoped>
#sensor-grid {
    display: grid;
    grid-template-columns:20% 20% 20% 20%;
    column-gap: 10px;
    row-gap: 10px;
}

.sensor-small {
    background-color:#f0f0f0;
    padding: 20px;
}

.sensorHot {
    background-color: green;
}

#sensor-options {
    font-size: 0.9em;
}
</style>

