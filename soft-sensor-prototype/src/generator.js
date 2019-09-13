export default class DataGenerator {
    Type;

    GenerateDataValue(data_type, min, max, tofixed=2) {
        if(data_type=="Float") {
            var highlightedNumber = Math.random() * (max - min) + min;
            highlightedNumber = highlightedNumber.toFixed(tofixed);
            return highlightedNumber;
        } else if(data_type=="String") {
            return result;
        } else {
            return data_type + " not supported";
        }
    };

    GenerateDataValueString(enumoptions) {
        var result = '';
        var OptionLength = enumoptions.length-1;
        if(OptionLength==0) {
            result = enumoptions[0];
        } else if(OptionLength>0) {
            var min = Math.ceil(0);
            var max = Math.floor(OptionLength);
            var index = Math.floor(Math.random() * (max - min + 1)) + min;
            result = enumoptions[index]
        } else {
            result = "No Options given";
        }
        return result;
    };

    GenerateDataValueInt(min, max) {
        return Math.floor(Math.random() * (max-min + 1)) + min;
    };

    GenerateDataValueBool() {
        var opt = [true, false];
        var index = Math.floor(Math.random()*(2));
        return opt[index];
    }

    GenerateForSensor(sensor) {
        for(var i=0; i<sensor.SmartObj.Resources.length; i++) {
            var res = sensor.SmartObj.Resources[i];
            if(res.GeneratorType!=3) {
                if(res.ResourceType=='String') {
                    res.ResourceValue = this.GenerateDataValueString(res.EnumOptions);
                } else if(res.ResourceType=='Integer') {
                    res.ResourceValue = this.GenerateDataValueInt(res.Range.min, res.Range.max);
                } else if(res.ResourceType=='Boolean') {
                    res.ResourceValue = this.GenerateDataValueBool();
                } else {
                        res.ResourceValue = this.GenerateDataValue(res.ResourceType,res.Range.min, res.Range.max, 2);
                }
            }


          }
    }

    constructor(type) {
        this.Type = type;
    }

}