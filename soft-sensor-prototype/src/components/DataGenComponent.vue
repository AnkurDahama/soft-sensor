<template>
    <div>

        <a href="#" v-on:click="OpenDataGenerator(sensor)"> Data Generator </a>

        <div class="popupbg" v-if="isDataGeneratorOpen">
            <div class="sensorSetting popup" > 
                <a class="popupClose" href="#" v-on:click="CloseDataGenerator"> close </a>
                <h1> {{CurrentDataGeneratorSensor.SmartObj.ObjectName}}: {{CurrentDataGeneratorSensor.SmartObj.ObjectID}}</h1>
                <hr/>
                 <b> Select Resource</b> 
                 <br/>
                <select class="form-field" v-model="CurrentResource" @change="DataGenResourceChanged($event)">
                        <option value="-1"> -- Select Resource -- </option>
                        <option v-for="(resource) in CurrentDataGeneratorSensor.SmartObj.Resources" :key="resource.ResourceID" :value="resource.ResourceID"> {{resource.ResourceName}} </option>
                </select>
                <br/>
                <select class="form-field" v-model="GeneratorType" >
                        <!-- @change="DataGenResourceChanged($event)" -->
                        <option value="-1"> -- Select Generator Type -- </option>
                        <option value="0"> Random Value Generator </option>
                        <option value="3">Fixed Value </option>
                        <option value="1"> Equation Based Generator </option>
                        <option value="2"> Probability Density Based Generator </option>
                </select>
                <hr/>
                <b> Resource Name </b> : {{CurrentResourceObj.ResourceName}} <br/>
                <b> Resource Type </b> : {{CurrentResourceObj.ResourceType}} <br/>
                <b> Resource Value </b> : {{CurrentResourceObj.ResourceValue}} <br/>

              
                <hr/>

            <!-- Form for Min Max -->

                <div v-if="GeneratorType!=-1&&CurrentResourceObj.ResourceType=='Float'&&GeneratorType!=3" class="input-form">
                    <div class="form-label">Range Min:</div> <div><input v-model="GeneratorRange.min" class="form-field" type="text" /></div> 
                    <div class="form-label">Range Max:</div> <div><input v-model="GeneratorRange.max" class="form-field" type="text" /></div> 
                </div>


                <div v-if="GeneratorType==3" class="input-form">
                    <div class="form-label">Fixed Value:</div> <div><input v-model="GeneratorRange.min" class="form-field" type="text" /></div> 
                </div>

                <div v-if="GeneratorType!=-1&&CurrentResourceObj.ResourceType=='String'&&GeneratorType!=3" class="input-form">
                    <div class="form-label">Add option:</div> <div><input v-model="NewEnumOption" class="form-field" type="text" /></div>
                    <div class="form-submit" v-on:click="AddNewEnum"> Add </div>
                    <div v-for="(options, index) in GeneratorEnum" :key="index">
                        <b>{{options}}</b>
                    </div> 
                </div>
            </div>
       </div>



    </div>
</template>

<script>

import Paho from "paho-mqtt"
import SmartObject from "../models.js"
export default {
    name: 'DataGenComponent',
    data() {
        return {
            CurrentDataGeneratorSensor: "",
            isDataGeneratorOpen: false,
            CurrentResource:"-1",
            GeneratorType: "-1",
            CurrentResourceObj : "",
            GeneratorRange: {"min":-1, "max":-1},
            GeneratorEnum: [],
            NewEnumOption: '',
        }
    },
    props: {
        sensor: ''
    },
    mounted() {
    },
    methods: {
        OpenDataGenerator: function(sensor) {
            this.CurrentDataGeneratorSensor = sensor;
            this.isDataGeneratorOpen = true;
        },

        CloseDataGenerator: function(sensor) {
            if(this.CurrentResource !== "-1" && this.GeneratorType !== "-1") {
            // update sensor
            this.$store.commit('CHANGE_SENSOR_INFO', {id: this.CurrentDataGeneratorSensor.SerialID, new: this.CurrentDataGeneratorSensor});
            
            //update resources 
            this.CurrentResourceObj.GeneratorType = this.GeneratorType;
            this.CurrentResourceObj.Range = this.GeneratorRange;
            this.CurrentResourceObj.EnumOptions = this.GeneratorEnum;
            if(this.GeneratorType==3) {
                this.CurrentResourceObj.ResourceValue = this.GeneratorRange.min;
            }
            this.$store.commit('CHANGE_SENSOR_RESOURCES', {sensorid: this.CurrentDataGeneratorSensor.SerialID, rid: this.CurrentResourceObj.ResourceID, new: this.CurrentResourceObj});
            }
            // reset variables
            this.isDataGeneratorOpen = false;
            this.CurrentDataGeneratorSensor = "";
            this.CurrentResource = "-1";
            this.CurrentResourceObj = "";
            this.GeneratorType = "-1";
            this.GeneratorRange = {"min":-1, "max":-1};
            this.GeneratorEnum = {};
            this.NewEnumOption = '';
        },
        AddNewEnum: function() {
            this.GeneratorEnum.push(this.NewEnumOption);
            this.NewEnumOption = '';
        },

        DataGenResourceChanged: function(event) {

            if(this.CurrentResource !== "-1" && this.GeneratorType !== "-1") {
            //update resources 
            this.CurrentResourceObj.GeneratorType = this.GeneratorType;
            this.CurrentResourceObj.Range = this.GeneratorRange;
            this.CurrentResourceObj.EnumOptions = this.GeneratorEnum;
            if(this.GeneratorType==3) {
                this.CurrentResourceObj.ResourceValue = this.GeneratorRange.min;
            }
            this.$store.commit('CHANGE_SENSOR_RESOURCES', {sensorid: this.CurrentDataGeneratorSensor.SerialID, rid: this.CurrentResourceObj.ResourceID, new: this.CurrentResourceObj});
            }

            this.CurrentResourceObj = this.CurrentDataGeneratorSensor.SmartObj.Resources.find(res => res.ResourceID == event.target.value);
            this.GeneratorType = this.CurrentResourceObj.GeneratorType;
            this.GeneratorRange = this.CurrentResourceObj.Range;
            this.GeneratorEnum = this.CurrentResourceObj.EnumOptions;
            this.NewEnumOption = '';
        },

    }
}
</script>

<style scoped>

</style>
