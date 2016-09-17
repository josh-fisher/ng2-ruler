import {Injectable} from "@angular/core";
import {Unit} from "../shared/enums/unit.enum";

@Injectable()
export class Units {
    types: Object = {
        "seconds":      { pixelsPerNUnit: 200, unitsPerRange: 20, hatchMarksPerNUnit: 10, symbol: 's' },
        "milliseconds": { pixelsPerNUnit: 200, unitsPerRange: 20, hatchMarksPerNUnit: 10, symbol: 'ms' },
        "centimeters":  { pixelsPerNUnit: 37.795276, unitsPerRange: 1, hatchMarksPerNUnit: 10, symbol: 'cm' },
        "millimeters":  { pixelsPerNUnit: 3.779528, unitsPerRange: 1, hatchMarksPerNUnit: 0, symbol: 'mm' },
        "inches":       { pixelsPerNUnit: 96, unitsPerRange: 1, hatchMarksPerNUnit: 16, symbol: 'in' },
        "feet":         { pixelsPerNUnit: 1152, unitsPerRange: 1, hatchMarksPerNUnit: 12, symbol: 'ft' },
        "pixels":       { pixelsPerNUnit: 100, unitsPerRange: 100, hatchMarksPerNUnit: 10, symbol: 'px' },
        "picas":        { pixelsPerNUnit: 160, unitsPerRange: 10, hatchMarksPerNUnit: 10, symbol: 'pc' },
        "points":       { pixelsPerNUnit: 133, unitsPerRange: 100, hatchMarksPerNUnit: 13.3, symbol: 'pt' }
    };

    getUnit(type: Unit) {
        var unit = undefined;
        for (var prop in this.types) {
            if( this.types.hasOwnProperty( prop ) ) {
                if (prop == Unit[type].toLowerCase()) {
                    unit = this.types[prop];
                    break;
                }
            }
        }
        return unit;
    }
}