<template>
    <div class="root-page-div">
        <h2> All Sensors </h2>

        <b> All Active Sensors </b>
        <br/>
        <div id="sensor-grid">
            <div class="sensor-small" v-for="(sensor) in this.$store.state.AllSensors" :key="sensor.sensor_id" :id="sensor.sensor_id">
               <b> {{sensor.sensor_id}} </b> - {{sensor.sensor_name}}:
               <small> {{sensor.sensor_topic}}</small> <br/>
               <a href="#" v-on:click="SendSignal(sensor.sensor_id)"> Send Signal </a>
            </div>
        </div>

        <br/> <br/>
        <b> Add New Sensor </b>
        <br/>
        <div class="input-form">
            <div class="form-label"> Sensor ID</div> <input class="form-field" type="text" v-model="NewSensor.sensor_id" />
            <div class="form-label"> Sensor Name</div> <input class="form-field" type="text" v-model="NewSensor.sensor_name" />
            <div class="form-label"> Sensor Topic</div> <input class="form-field" type="text" v-model="NewSensor.sensor_topic" />
            <div class="form-label"> Sensor Data</div> <input class="form-field" type="text" v-model="NewSensor.sensor_data" />

            <div class="form-submit" v-on:click="AddNewSensor"> Add </div>
        </div>
        <a href="#" v-on:click="DeleteSensor"> delete last </a>
        
    </div>
</template>

<script>
export default {
    name: 'SensorList',
    data() {
        return {
            NewSensor: {
                sensor_id: "",
                sensor_name: "",
                sensor_data: "",
                sensor_topic: "",
            },
            NewId: "",
        }
    },
    mounted() {
        var curr_Length= this.$store.state.AllSensors.length;
        this.NewId = this.$store.state.AllSensors[curr_Length-1].sensor_id + 1;
        this.NewSensor.sensor_id = this.NewId;

        this.$root.$on('signal_sent', (id) => {
            // Turn the background back to normal
            document.getElementById(id).classList.remove("sensorHot");
        })
    },
    methods: {
        SendSignal: function(id) {
            document.getElementById(id).classList.add("sensorHot")
            this.$root.$emit('send_signal', id);
        },
        AddNewSensor: function() {
            this.$store.commit('PUSH_NEW_SENSOR', {sensor_id: this.NewSensor.sensor_id, sensor_name: this.NewSensor.sensor_name, sensor_topic:this.NewSensor.sensor_topic, sensor_data: this.NewSensor.sensor_data});
            this.NewSensor.sensor_id = ++this.NewId;
            this.NewSensor.sensor_name = "";
            this.NewSensor.sensor_data = "";

        },
        DeleteSensor: function() {
            console.log(this.$store.state.AllSensors[0].sensor_name);
            this.$store.commit('DELETE_SENSOR');
            this.AllSensor_local.shift();
            console.log(this.$store.state.AllSensors[0].sensor_name);
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
</style>

