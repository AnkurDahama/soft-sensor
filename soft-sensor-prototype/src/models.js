class SmartResources {
    GeneratorType;
    Range;
    EnumOptions;
    ResourceID;
    ResourceName;
    ResourceType;
    ResourceValue;
    constructor(name, id, type, defaultVal) {
       this.ResourceName = name;
       this.ResourceID = id;
       this.ResourceType = type;
       this.ResourceValue = defaultVal;
       this.GeneratorType = 0;
       this.Range = {"min":0, "max":100};
       this.EnumOptions = [];
   }
}

export default class SmartObject {
    ObjectTopic;
    SerialID;
    EmitFreq;
    SmartObj = {
        ObjectID:'',
        ObjectName:'',
        ObjectURN:'',
        MultipleInstance:'',
        Description:'',
        Resources:[]
    };
    GetResourceObjectByID(id) {
        for (res in this.Resources) {
            if(res.ResourceID == id) {
                return res;
            }
        }
    }

    constructor(sid, id, multi_ins, response) {
        
     //   const axios = require('axios');
        var str = "";
     //   var uri = "https://raw.githubusercontent.com/OpenMobileAlliance/lwm2m-registry/test/" + id + ".xml";
    //    axios.get(uri).then((response) => {
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
                    if(res.Type[0]!=''){
                        all_res.push(new SmartResources(res.Name[0], res.$.ID, res.Type[0], 0));
                    }
                }
                
            });
            this.SmartObj.ObjectName = name;
            this.SmartObj.Description = desc;
            this.SmartObj.ObjectURN = urn;
            this.SmartObj.Resources = all_res;
            this.SerialID = sid;
            this.SmartObj.ObjectID = id;
            this.SmartObj.MultipleInstance = multi_ins;
            this.ObjectTopic = "thesis/test";
            this.EmitFreq = 0;
       //   })



    }

  }
