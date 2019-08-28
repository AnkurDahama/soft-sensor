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
    GetResourceObjectByID(id) {
        for (res in this.Resources) {
            if(res.ResourceID == id) {
                return res;
            }
        }
    }

    constructor(sid, id, multi_ins) {
        this.SerialID = sid;
        this.ObjectID = id;
        this.ObjectURN = "";
        this.MultipleInstance = multi_ins;
        this.Description = "";
        this.ObjectTopic = "thesis/test";
        this.ObjectName = AssignObjectValuesByID(id);
        this.Resources = ResourceByID(id);
    }

  }

  function AssignObjectValuesByID(id) {
    if(id==3303) {
        return "Temperature Sensor";
    } else if(id==3313) {
        return "Accelerometer";
    } else if(id==3302) {
        return "Presence Sensor";
    } else if(id==3314) {
        return "Magnetometer";
    } else if(id==3315) {
        return "Barometer";
    }
    return "Unknown";
}

function ResourceByID(id) {
    if(id==3303) {
        return [new SmartResources("Sensor Value", 5700, "Float", 0.01), 
                new SmartResources("Units", 5701, "String", "Celcius"), 
                new SmartResources("Min Measured Value", 5601, "Float", 0.01), 
                new SmartResources("Max Measured Value", 5602, "Float", 0.01), 
                new SmartResources("Min Range Value", 5603, "Float", 0.01), 
                new SmartResources("Max Range Value", 5604, "Float", 0.01)
            ];
    } else {
        return [new SmartResources("Sensor Value", 5700, "Float", 0.01)];
    }
    
}