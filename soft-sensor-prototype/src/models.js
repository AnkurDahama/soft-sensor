class SmartResources {
    ResourceID;
    ResourceName;
    ResourceType;
    ResourceValue;
    GeneratorType;
    Range;
    constructor(name, id, type, defaultVal) {
       this.ResourceName = name;
       this.ResourceID = id;
       this.ResourceType = type;
       this.ResourceValue = defaultVal;
       this.GeneratorType = 0;
       this.Range = {"min":0, "max":100}
   }
}

export default class SmartObject {
    ObjectID;
    ObjectName;
    ObjectURN;
    MultipleInstance;
    Description;
    ObjectTopic;
    SerialID;
    Resources;
    EmitFreq;
    GetResourceObjectByID(id) {
        for (res in this.Resources) {
            if(res.ResourceID == id) {
                return res;
            }
        }
    }

    constructor(sid, id, multi_ins) {
        const axios = require('axios');
        var str = "";
        var uri = "https://raw.githubusercontent.com/OpenMobileAlliance/lwm2m-registry/test/" + id + ".xml";
        axios.get(uri).then((response) => {
            str = response.data;
            var parseString = require('xml2js').parseString;
            var name = "";
            var desc = "";
            var urn = "";
            var all_res = [];
            parseString(str, function (err, result) {
                name = result.LWM2M.Object[0].Name[0];
                desc = result.LWM2M.Object[0].Description1[0];
                urn = result.LWM2M.Object[0].ObjectURN[0];
                for(var i=0; i<result.LWM2M.Object[0].Resources[0].Item.length; i++) {
                    var res = result.LWM2M.Object[0].Resources[0].Item[i];
                    all_res.push(new SmartResources(res.Name[0], res.$.ID, res.Type[0], 0));
                }
                
            });
            this.ObjectName = name;
            this.Description = desc;
            this.ObjectURN = urn;
            this.Resources = all_res;
            this.SerialID = sid;
            this.ObjectID = id;
            this.MultipleInstance = multi_ins;
            this.ObjectTopic = "thesis/test";
            this.EmitFreq = -1;
          })



    }

  }

//   function AssignObjectValuesByID(id) {
//     if(id==3303) {
//         return "Temperature Sensor";
//     } else if(id==3313) {
//         return "Accelerometer";
//     } else if(id==3302) {
//         return "Presence Sensor";
//     } else if(id==3314) {
//         return "Magnetometer";
//     } else if(id==3315) {
//         return "Barometer";
//     }
//     return "Unknown";
// }

// function ResourceByID(id) {
//     if(id==3303) {
//         return [new SmartResources("Sensor Value", 5700, "Float", 0.01), 
//                 new SmartResources("Units", 5701, "String", "Celcius"), 
//                 new SmartResources("Min Measured Value", 5601, "Float", 0.01), 
//                 new SmartResources("Max Measured Value", 5602, "Float", 0.01), 
//                 new SmartResources("Min Range Value", 5603, "Float", 0.01), 
//                 new SmartResources("Max Range Value", 5604, "Float", 0.01)
//             ];
//     } else {
//         return [new SmartResources("Sensor Value", 5700, "Float", 0.01)];
//     }
    
// }