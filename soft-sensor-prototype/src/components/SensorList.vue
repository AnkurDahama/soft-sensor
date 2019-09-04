<template>
    <div class="root-page-div">
        <h2> All Sensors <small><a href="#" v-on:click="isAddNewOpen=true">&nbsp(Add)</a> </small> </h2>

        <b> All Active Sensors </b>
        <br/>
        <div id="sensor-grid">
            <div class="sensor-small" v-for="(sensor) in this.$store.state.AllSensors" :key="sensor.SerialID" :id="sensor.SerialID">
               <b> {{sensor.ObjectID}}  -  {{sensor.ObjectName}} </b>
                <br/> <br/>
                <div id="sensor-options">
               <a v-if="sensor.EmitFreq==-1" href="#" v-on:click="SendSignal(sensor.SerialID)"> Send Signal </a> 
               <a v-if="sensor.EmitFreq!=-1&&intervals.find(intv=>intv.sensorid == sensor.SerialID)&&intervals.find(intv=>intv.sensorid == sensor.SerialID).isactive==true" href="#" v-on:click="StopInt(sensor)"> Pause Emitting </a>
               <a v-if="sensor.EmitFreq!=-1&&intervals.find(intv=>intv.sensorid == sensor.SerialID)&&intervals.find(intv=>intv.sensorid == sensor.SerialID).isactive==false" href="#" v-on:click="ChangeIntTime(sensor)"> Resume Emitting </a> 
               
               <br/><br/>
               <a href="#" v-on:click="OpenSettings(sensor)"> Settings </a>
               <br/><br/>
               <a href="#" v-on:click="OpenDataGenerator(sensor)"> Data Generator </a>
               <br/><br/>
               <a href="#" v-on:click="DeleteSensor(sensor.SerialID)"> Delete </a>
                </div>
            </div>
        </div>

        <br/> <br/>
        
        <br/>
        <div class="popupbg" v-if="isAddNewOpen">
            <div class="sensorSetting popup" > 
            <a class="popupClose" href="#" v-on:click="isAddNewOpen=false"> close </a>
            <div class="input-form">
            <div class="form-label"> Object ID</div> <select class="form-field" v-model="NewSensor.ObjectID" >
                                                        <option value="3303"> IPSO Temperature Sensor :3303 </option>
                                                        <option value="3313"> IPSO Accelerometer :3313 </option>
                                                        <option value="3302"> IPSO Presence Sensor :3302 </option>
                                                        <option value="3314"> IPSO Magnetometer :3314 </option>
                                                        <option value="3315"> IPSO Barometer :3315 </option>
                                                     </select>
            <div class="form-label"> Multiple Instances?</div> <select class="form-field" v-model="NewSensor.MultipleInstance" > 
                                                                    <option value="true"> Yes </option>
                                                                    <option value="false"> No </option>
                                                                </select>

            <div class="form-submit" v-on:click="AddNewSensor"> Add </div>
            </div>
        </div>
        </div>




       <div class="popupbg" v-if="isSettingOpen">
            <div class="sensorSetting popup" > 
                <a class="popupClose" href="#" v-on:click="CloseSettings"> close </a>
                <h1> {{CurrentSettingSensor.ObjectName}}: {{CurrentSettingSensor.ObjectID}}</h1>
                <hr/>
                <b> {{CurrentSettingSensor.SerialID}} </b> <br/> Topic : {{CurrentSettingSensor.ObjectTopic}} 
                <hr/>
                <h3>  Resources  </h3>
                <!-- <textarea class="form-field" v-model="CurrentSettingSensor.sensor_data">  </textarea> -->
                <small><a href="#" v-on:click="GetGeneratedData"> Generate Data </a></small>
                <div v-for="(resource) in CurrentSettingSensor.Resources" :key="resource.ResourceID">
                    <b>{{resource.ResourceID}} : {{resource.ResourceName}}</b> {{resource.ResourceValue}} <small> ({{resource.ResourceType}})</small>
                </div>
                <hr/>

                 <div class="input-form">
                    <div class="form-label">Time Period(seconds):</div> <div><input v-model="CurrentSettingSensor.EmitFreq" class="form-field" type="text" /></div> 
                </div>
                

            </div>
       </div>

       <div class="popupbg" v-if="isDataGeneratorOpen">
            <div class="sensorSetting popup" > 
                <a class="popupClose" href="#" v-on:click="CloseDataGenerator"> close </a>
                <h1> {{CurrentDataGeneratorSensor.ObjectName}}: {{CurrentDataGeneratorSensor.ObjectID}}</h1>
                <hr/>
                <!-- <small><a href="#" v-on:click="GetGeneratedData"> Generate Data </a></small> -->
                 <b> Select Resource</b> 
                 <br/>
                    <select class="form-field" v-model="CurrentResource" @change="DataGenResourceChanged($event)">
                        <option value="-1"> -- Select Resource -- </option>
                        <option v-for="(resource) in CurrentDataGeneratorSensor.Resources" :key="resource.ResourceID" :value="resource.ResourceID"> {{resource.ResourceName}} </option>
                    </select>
                <br/>
                    <select class="form-field" v-model="GeneratorType" >
                        <!-- @change="DataGenResourceChanged($event)" -->
                        <option value="-1"> -- Select Generator Type -- </option>
                        <option value="0"> Random Value Generator </option>
                        <option value="1"> Equation Based Generator </option>
                        <option value="2"> Probability Density Based Generator </option>
                    </select>
                <hr/>
                <b> Resource Name </b> : {{CurrentResourceObj.ResourceName}} <br/>
                <b> Resource Type </b> : {{CurrentResourceObj.ResourceType}} <br/>
                <b> Resource Value </b> : {{CurrentResourceObj.ResourceValue}} <br/>

            <hr/>

            <!-- Form for Min Max -->

            <div v-if="GeneratorType!=-1" class="input-form">
            <div class="form-label">Range Min:</div> <div><input v-model="GeneratorRange.min" class="form-field" type="text" /></div> 
            <div class="form-label">Range Max:</div> <div><input v-model="GeneratorRange.max" class="form-field" type="text" /></div> 

        </div>
        
            


            </div>
       </div>



    </div>
</template>

<script>

import SmartObject from "../models.js"
import DataGenerator from "../generator.js" 
import { setInterval } from 'timers';
export default {
    name: 'SensorList',
    data() {
        return {
            NewSensor: {
                ObjectID: "3303",
                MultipleInstance: false,
            },
            NewId: 0,
            isSettingOpen: false,
            isAddNewOpen: false,
            isDataGeneratorOpen: false,
            CurrentSettingSensor: "",
            CurrentDataGeneratorSensor: "",
            CurrentResource:"-1",
            CurrentResourceObj : "",
            GeneratorType: "-1",
            GeneratorRange: {"min":-1, "max":-1},
            Generator: new DataGenerator(1),
            intervals: [],
        }
    },
    mounted() {

       // this.$store.commit('SPECIAL_DELETE', 0);
        var curr_Length= this.$store.state.AllSensors.length;
        this.NewId = this.$store.state.AllSensors[curr_Length-1].SerialID + 1;
        this.NewSensor.SerialID = this.NewId;

        this.$root.$on('signal_sent', (id) => {
            // Turn the background back to normal
            document.getElementById(id).classList.remove("sensorHot");
        });

        // Signal Emitter
        for(var i=0; i<this.$store.state.AllSensors.length; i++) {
            this.StartInt(this.$store.state.AllSensors[i]);
        }
        // this.interval = setInterval(() => this.SendSignal(this.$store.state.AllSensors[0].SerialID), 1000);
        // this.interval = setInterval(() => this.SendSignal(this.$store.state.AllSensors[1].SerialID), 2000);
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
            document.getElementById(id).classList.add("sensorHot")
            this.$root.$emit('send_signal', id);
        },
        AddNewSensor: function() {
            var NewSmartObj = new SmartObject(this.NewId ,this.NewSensor.ObjectID, this.NewSensor.MultipleInstance);
            this.$store.commit('PUSH_NEW_SENSOR', NewSmartObj);
            this.NewId++;
            this.NewSensor.ObjectID = "";
            this.isAddNewOpen = false;

        },
        DeleteSensor: function(id) {
            this.$store.commit('DELETE_SENSOR', id);
        },

        OpenSettings: function(sensor) {
            this.CurrentSettingSensor = sensor;
            this.isSettingOpen = true;
        },
        OpenDataGenerator: function(sensor) {
            this.CurrentDataGeneratorSensor = sensor;
            this.isDataGeneratorOpen = true;
        },
        CloseSettings: function(sensor) {
            this.$store.commit('CHANGE_SENSOR_INFO', {id: this.CurrentSettingSensor.SerialID, new: this.CurrentSettingSensor});
            this.isSettingOpen = false;
            if(this.CurrentSettingSensor.EmitFreq != -1) {
                this.ChangeIntTime(this.CurrentSettingSensor);
            } else {
                this.StopInt(this.CurrentSettingSensor);
            }
            
            this.CurrentSettingSensor = "";
        },


        CloseDataGenerator: function(sensor) {
            if(this.CurrentResource !== "-1" && this.GeneratorType !== "-1") {
            // update sensor
            this.$store.commit('CHANGE_SENSOR_INFO', {id: this.CurrentDataGeneratorSensor.SerialID, new: this.CurrentDataGeneratorSensor});
            
            //update resources 
            this.CurrentResourceObj.GeneratorType = this.GeneratorType;
            this.CurrentResourceObj.Range = this.GeneratorRange;
            this.$store.commit('CHANGE_SENSOR_RESOURCES', {sensorid: this.CurrentDataGeneratorSensor.SerialID, rid: this.CurrentResourceObj.ResourceID, new: this.CurrentResourceObj});
            }
            // reset variables
            this.isDataGeneratorOpen = false;
            this.CurrentDataGeneratorSensor = "";
            this.CurrentResource = "-1";
            this.CurrentResourceObj = "";
            this.GeneratorType = "-1";
            this.GeneratorRange = {"min":-1, "max":-1};

        },


        DataGenResourceChanged: function(event) {

            if(this.CurrentResource !== "-1" && this.GeneratorType !== "-1") {
            //update resources 
            this.CurrentResourceObj.GeneratorType = this.GeneratorType;
            this.CurrentResourceObj.Range = this.GeneratorRange;
            this.$store.commit('CHANGE_SENSOR_RESOURCES', {sensorid: this.CurrentDataGeneratorSensor.SerialID, rid: this.CurrentResourceObj.ResourceID, new: this.CurrentResourceObj});
            }

            this.CurrentResourceObj = this.CurrentDataGeneratorSensor.Resources.find(res => res.ResourceID == event.target.value);
            this.GeneratorType = this.CurrentResourceObj.GeneratorType;
            this.GeneratorRange = this.CurrentResourceObj.Range;
        },
        GetGeneratedData: function() {
            this.Generator.GenerateForSensor(this.CurrentSettingSensor);
        }
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

