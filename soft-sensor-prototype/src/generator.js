export default class DataGenerator {
    Type;

    GenerateDataValue(data_type, min, max, tofixed=2) {
        if(data_type=="Float") {
            var highlightedNumber = Math.random() * (max - min) + min;
            highlightedNumber = highlightedNumber.toFixed(tofixed);
            return highlightedNumber;
        } else if(data_type=="String") {
            return "String not suppported";
        }
    };

    GenerateForSensor(sensor) {
        for(var i=0; i<sensor.Resources.length; i++) {
            var res = sensor.Resources[i];
            res.ResourceValue = this.GenerateDataValue(res.ResourceType,-10.0, 40.5);

          }
    }

    constructor(type) {
        this.Type = type;
    }

}