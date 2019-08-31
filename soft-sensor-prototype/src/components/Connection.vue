<template>
    <div class="root-div">
        <h2 class="root-heading"> Connect to the Platform </h2>
        <div class="input-form">
        <div class="form-label"> Select Platform</div> <select class="form-field" v-model="PlatformChoice"> 
                                                                    <option value="cloudmqtt"> CloudMqtt </option>
                                                                    <option value="aws"> Amazon AWS </option>
                                                                </select>
        </div>
        <hr/>


        <div v-if="PlatformChoice=='cloudmqtt'" class="input-form">

            <div class="form-label">Host:</div> <div><input class="form-field" type="text" name="mqtt_host" v-model="host" /></div>
            <div class="form-label">Port:</div> <div><input class="form-field" type="number" name="mqtt_port" v-model="port" /></div>
            <div class="form-label">ClientID:</div> <div><input class="form-field" type="text" name="mqtt_clientid" v-model="clientId" /></div>
            <div class="form-label">Username:</div> <div><input class="form-field" type="text" name="mqtt_username" v-model="username" /></div> 
            <div class="form-label">Password:</div> <div><input class="form-field" type="text" name="mqtt_password" v-model="password" /></div> 

            <div class="form-submit" v-on:click="ConnectToMqtt">Connect</div>

        </div>

        <div v-if="PlatformChoice=='aws'" class="input-form">

            <div class="form-label">Endpoint:</div> <div><input class="form-field" type="text" v-model="AWSendpoint" /></div>
            <div class="form-label">Region:</div> <div><input class="form-field" type="text" v-model="AWSregion" /></div>
            <div class="form-label">ClientID:</div> <div><input class="form-field" type="text" v-model="clientId" /></div>
            <div class="form-label">Access Key ID:</div> <div><input class="form-field" type="text" v-model="AWSaccessKeyID" /></div> 
            <div class="form-label">Secret Access Key:</div> <div><input class="form-field" type="text" v-model="AWSaccessKeySec" /></div> 

            <div class="form-submit" v-on:click="ConnectToMqttAWS">Connect to AWS</div>

        </div>
        

        
    </div>
</template>

<script>

    function SigV4Utils() {}
            SigV4Utils.getSignatureKey = function (key, date, region, service) {
                var kDate = AWS.util.crypto.hmac('AWS4' + key, date, 'buffer');
                var kRegion = AWS.util.crypto.hmac(kDate, region, 'buffer');
                var kService = AWS.util.crypto.hmac(kRegion, service, 'buffer');
                var kCredentials = AWS.util.crypto.hmac(kService, 'aws4_request', 'buffer');    
                return kCredentials;
            }
            SigV4Utils.getSignedUrl = function(host, region, credentials) {
                var datetime = AWS.util.date.iso8601(new Date()).replace(/[:\-]|\.\d{3}/g, '');
                var date = datetime.substr(0, 8);
                var method = 'GET';
                var protocol = 'wss';
                var uri = '/mqtt';
                var service = 'iotdevicegateway';
                var algorithm = 'AWS4-HMAC-SHA256';
                var credentialScope = date + '/' + region + '/' + service + '/' + 'aws4_request';
                var canonicalQuerystring = 'X-Amz-Algorithm=' + algorithm;
                canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(credentials.accessKeyId + '/' + credentialScope);
                canonicalQuerystring += '&X-Amz-Date=' + datetime;
                canonicalQuerystring += '&X-Amz-SignedHeaders=host';
                var canonicalHeaders = 'host:' + host + '\n';
                var payloadHash = AWS.util.crypto.sha256('', 'hex')
                var canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
                var stringToSign = algorithm + '\n' + datetime + '\n' + credentialScope + '\n' + AWS.util.crypto.sha256(canonicalRequest, 'hex');
                var signingKey = SigV4Utils.getSignatureKey(credentials.secretAccessKey, date, region, service);
                var signature = AWS.util.crypto.hmac(signingKey, stringToSign, 'hex');

                canonicalQuerystring += '&X-Amz-Signature=' + signature;
                var requestUrl = protocol + '://' + host + uri + '?' + canonicalQuerystring;
                return requestUrl;
            };




import Paho from "paho-mqtt"
import AWS from "aws-sdk"
export default {
    name: 'Connection',
    data() {
        return {
            host: "postman.cloudmqtt.com",
            port: 30495,
            clientId: "web_" + parseInt(Math.random() * 100, 10),
            username: "cpqxvzdh",
            password: "f5128TgA2ZlL",
            isConnected: false,
            PlatformChoice: "cloudmqtt",
            AWSendpoint: "a3h2nrfgdvo8qp-ats.iot.eu-north-1.amazonaws.com",
            AWSregion: "eu-north-1",
            AWSaccessKeyID: "AKIAIUQNEYXOVKVMQYIA",
            AWSaccessKeySec: "SVhLC53RGTI0CnzO2unmQ4REYVGZeg9pg7tw4YJq"
        }
    },
    methods: {

        ConnectToMqttAWS: function() {

            var datetime = AWS.util.date.iso8601(new Date()).replace(/[:\-]|\.\d{3}/g, '');
            var date = datetime.substr(0, 8);

            var method = 'GET';
            var host = this.AWSendpoint;
            var protocol = 'wss';
            var uri = '/mqtt';
            var region = this.AWSregion;
            var service = 'iotdevicegateway';
            var algorithm = 'AWS4-HMAC-SHA256';
            var credentials = {
            accessKeyId: this.AWSaccessKeyID,
            secretAccessKey: this.AWSaccessKeySec
            };
            var credentialScope = date + '/' + region + '/' + service + '/' + 'aws4_request';
            var canonicalQuerystring = 'X-Amz-Algorithm=' + algorithm;
            canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(credentials.accessKeyId + '/' + credentialScope);
            canonicalQuerystring += '&X-Amz-Date=' + datetime;
            canonicalQuerystring += '&X-Amz-SignedHeaders=host';
            var canonicalHeaders = 'host:' + host + '\n';
            var payloadHash = AWS.util.crypto.sha256('', 'hex')
            var canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
            var stringToSign = algorithm + '\n' + datetime + '\n' + credentialScope + '\n' + AWS.util.crypto.sha256(canonicalRequest, 'hex');
            var signingKey = SigV4Utils.getSignatureKey(credentials.secretAccessKey, date, region, service);
            var signature = AWS.util.crypto.hmac(signingKey, stringToSign, 'hex');
            canonicalQuerystring += '&X-Amz-Signature=' + signature;
            var requestUrl = protocol + '://' + host + uri + '?' + canonicalQuerystring;


            this.$CreateClientAWS(requestUrl, this.clientId);
		    this.$client.obj.onConnectionLost = this.onConnectionLost;
            var options = {
                useSSL: true,
                timeout: 300,
                mqttVersion: 4,
                onSuccess:this.onConnect
            }
            this.$client.obj.connect(options);
        },


        ConnectToMqtt: function() {
            this.$CreateClient(this.host, this.port, this.clientId);
		    this.$client.obj.onConnectionLost = this.onConnectionLost;

            var options = {
                useSSL: true,
                userName: this.username,
                password: this.password,
                onSuccess:this.onConnect
            }


            this.$client.obj.connect(options);
        },
        onConnect: function() {
            console.log("Connected");

            this.$root.$emit('connected');
            
            this.isConnected = true;
        },
        onConnectionLost: function(responseObject) {
            if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
            this.isConnected = false;
            this.$root.$emit('disconnected');
  		    }
        }

        
    }
}
</script>

<style scoped>

</style>
