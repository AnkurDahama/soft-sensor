<template>
    <div>
        <a href="#" v-on:click="isAddNewOpen=true"><b>+</b> Add new Sensor</a>
            <div class="popupbg" v-if="isAddNewOpen">
            <div class="sensorSetting popup" > 
            <a class="popupClose" href="#" v-on:click="isAddNewOpen=false"> close </a>
            <div class="input-form">
            <div class="form-label"> Object ID</div> <select class="form-field" v-model="NewSensor.SmartObj.ObjectID" >
                                                        <option value="3303"> IPSO Temperature Sensor :3303 </option>
                                                        <option value="3313"> IPSO Accelerometer :3313 </option>
                                                        <option value="3302"> IPSO Presence Sensor :3302 </option>
                                                        <option value="3314"> IPSO Magnetometer :3314 </option>
                                                        <option value="3315"> IPSO Barometer :3315 </option>
                                                     </select>
            <div class="form-label"> Multiple Instances?</div> <select class="form-field" v-model="NewSensor.SmartObj.MultipleInstance" > 
                                                                    <option value="true"> Yes </option>
                                                                    <option value="false"> No </option>
                                                                </select>

            <div class="form-submit" v-on:click="AddNewSensor"> Add </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>

import Paho from "paho-mqtt"
import SmartObject from "../models.js"
export default {
    name: 'AddSensor',
    data() {
        return {
            NewId: 0,
            isAddNewOpen: false,
            NewSensor: {
                SmartObj: {
                   ObjectID: "3303",
                    MultipleInstance: false, 
                }
            },
        }
    },
    mounted() {
        if(this.$store.state.AllSensors.length!=0) {
            var curr_Length= this.$store.state.AllSensors.length;
            this.NewId = this.$store.state.AllSensors[curr_Length-1].SerialID + 1;
            this.NewSensor.SerialID = this.NewId;
       }
    },
    methods: {
        AddNewSensor: function() {
            const axios = require('axios');
            var uri = "https://raw.githubusercontent.com/OpenMobileAlliance/lwm2m-registry/test/" + this.NewSensor.SmartObj.ObjectID + ".xml";
            
            axios.get(uri).then((response) => {
                var NewSmartObj = new SmartObject( 
                                                    this.NewId ,
                                                    this.NewSensor.SmartObj.ObjectID, 
                                                    this.NewSensor.SmartObj.MultipleInstance, 
                                                    response
                                                );
                this.$store.commit('PUSH_NEW_SENSOR', NewSmartObj);
                this.NewId++;
                this.NewSensor.SmartObj.ObjectID = "";
                this.isAddNewOpen = false;
            });

        },
    }
}
</script>

<style scoped>

</style>
