import {Injectable} from '@angular/core';
import {RulerService} from './ruler.service';
import {RulerMode} from '../shared/enums/rulermode.enum';
import {Orientation} from '../shared/enums/orientation.enum';
import {UnitType} from '../shared/enums/unit.enum';

export class Unit {
  pixelsPerNUnit: number = 0;
  unitsPerRange: number = 0;
  symbol: string = '';
  showUnits: boolean = true;
  showUnitSymbols: boolean = true;
  hatchUnits: Array<Unit> = [];
  hatchSize: number = 0;
  fontSize: number = 11;
  hatchColor: string;

  constructor (rulerService: RulerService, params: any) {
    this.pixelsPerNUnit = params.pixelsPerNUnit;
    this.unitsPerRange = params.unitsPerRange;
    this.symbol = params.symbol;
    this.hatchUnits = (params.hatchUnits) ? params.hatchUnits : [];
    this.showUnits = (params.showUnits != undefined) ? params.showUnits : true;
    this.showUnitSymbols = (params.showUnitSymbols != undefined) ? params.showUnitSymbols : true;
    this.hatchSize = (params.hatchSize != undefined) ? params.hatchSize : rulerService.defaultSize / 3;
    this.fontSize = (params.fontSize != undefined) ? params.fontSize : rulerService.defaultFontSize;
    this.hatchColor = (params.hatchColor != undefined) ? params.hatchColor : undefined;

    if (rulerService.rulerMode === RulerMode.Fit && rulerService.orientation === Orientation.Horizontal) {
      this.pixelsPerNUnit = (rulerService.offsetWidth / rulerService.range.end) * this.unitsPerRange;
    } else if (rulerService.rulerMode === RulerMode.Fit && rulerService.orientation === Orientation.Vertical) {
      this.pixelsPerNUnit = (rulerService.offsetHeight / rulerService.range.end) * this.unitsPerRange;
    }
  }
}

@Injectable()
export class Milliseconds extends Unit {
  constructor (rulerService: RulerService) {
    super(rulerService, {
      pixelsPerNUnit: 200,
      unitsPerRange: 20,
      symbol: 'ms'
    });
  }
}

@Injectable()
export class Seconds extends Unit {
  constructor (rulerService: RulerService) {
    let ms = new Milliseconds(rulerService);
    ms.showUnits = false;
    ms.showUnitSymbols = false;
    ms.hatchSize = rulerService.defaultSize / 4;
    ms.pixelsPerNUnit = 10;

    super(rulerService, {
      pixelsPerNUnit: 200,
      unitsPerRange: 20,
      symbol: 's',
      hatchUnits: [ms]
    });
  }
}

@Injectable()
export class Millimeters extends Unit {
  constructor (rulerService: RulerService) {
    super(rulerService, {
      pixelsPerNUnit:  3.779528,
      unitsPerRange: 1,
      symbol: 'mm'
    });
  }
}

@Injectable()
export class Centimeters extends Unit {
  constructor (rulerService: RulerService) {
    let mm = new Millimeters(rulerService);
    mm.showUnits = false;
    mm.showUnitSymbols = false;
    mm.hatchSize = rulerService.defaultSize / 4;

    super(rulerService, {
      pixelsPerNUnit: 37.795276,
      unitsPerRange: 1,
      symbol: 'cm',
      hatchUnits: [mm]
    });
  }
}

@Injectable()
export class Inches extends Unit {
  constructor (rulerService: RulerService) {
    let halfInchUnit = new Unit(rulerService, {
      pixelsPerNUnit: 48,
      unitsPerRange: 1,
      symbol: 'in',
      showUnits: false,
      showUnitSymbols: false,
      hatchSize: rulerService.defaultSize / 4,
    });
    let quarterInchUnit = new Unit(rulerService, {
      pixelsPerNUnit: 24,
      unitsPerRange: 1,
      symbol: 'in',
      showUnits: false,
      showUnitSymbols: false,
      hatchSize: rulerService.defaultSize / 5,
    });
    let eigthInchUnit = new Unit(rulerService, {
      pixelsPerNUnit: 12,
      unitsPerRange: 1,
      symbol: 'in',
      showUnits: false,
      showUnitSymbols: false,
      hatchSize: rulerService.defaultSize / 6,
    });
    let sixteenthInchUnit = new Unit(rulerService, {
      pixelsPerNUnit: 6,
      unitsPerRange: 1,
      symbol: 'in',
      showUnits: false,
      showUnitSymbols: false,
      hatchSize: rulerService.defaultSize / 7,
    });
    super(rulerService, {
      pixelsPerNUnit: 96,
      unitsPerRange: 1,
      symbol: 'in',
      hatchUnits: [halfInchUnit, quarterInchUnit, eigthInchUnit, sixteenthInchUnit]
    });
  }
}

@Injectable()
export class Feet extends Unit {
  constructor (rulerService: RulerService) {
    let inches = new Inches(rulerService);
    inches.showUnits = false;
    inches.showUnitSymbols = false;
    inches.hatchSize = rulerService.defaultSize / 4;

    let hatchUnits = inches.hatchUnits;
    hatchUnits.push(inches);

    super(rulerService, {
      pixelsPerNUnit: 1152,
      unitsPerRange: 1,
      symbol: 'ft',
      hatchUnits: hatchUnits
    });
  }
}

@Injectable()
export class Pixels extends Unit {
  constructor (rulerService: RulerService) {
    super(rulerService, {
      pixelsPerNUnit: 100,
      unitsPerRange: 100,
      symbol: 'px'
    });
  }
}

@Injectable()
export class Points extends Unit {
  constructor (rulerService: RulerService) {
    let px = new Pixels(rulerService);
    px.showUnits = false;
    px.showUnitSymbols = false;
    px.hatchSize = rulerService.defaultSize / 4;
    px.pixelsPerNUnit = 13.3;

    super(rulerService, {
      pixelsPerNUnit: 133,
      unitsPerRange: 100,
      symbol: 'pt',
      hatchUnits: [px]
    });
  }
}

@Injectable()
export class Picas extends Unit {
  constructor (rulerService: RulerService) {
    let pt = new Points(rulerService);
    pt.showUnits = false;
    pt.showUnitSymbols = false;
    pt.hatchSize = rulerService.defaultSize / 4;
    pt.pixelsPerNUnit = 16;

    pt.hatchUnits[0].pixelsPerNUnit = 1.6;
    pt.hatchUnits[0].hatchSize = rulerService.defaultSize / 6;

    let hatchUnits = pt.hatchUnits;
    hatchUnits.push(pt);

    super(rulerService, {
      pixelsPerNUnit: 160,
      unitsPerRange: 10,
      symbol: 'pc',
      hatchUnits: hatchUnits
    });
  }
}

@Injectable()
export class UnitsService {
  types: Object = {};

  constructor (rulerService: RulerService) {
    this.types = {
      'seconds':      new Seconds(rulerService),
      'milliseconds': new Milliseconds(rulerService),
      'centimeters':  new Centimeters(rulerService),
      'millimeters':  new Millimeters(rulerService),
      'inches':       new Inches(rulerService),
      'feet':         new Feet(rulerService),
      'pixels':       new Pixels(rulerService),
      'picas':        new Picas(rulerService),
      'points':       new Points(rulerService)
    };
  }

  getUnit(type: UnitType) {
    var unit = undefined;
    for (var prop in this.types) {
      if( this.types.hasOwnProperty( prop ) ) {
        if (prop == UnitType[type].toLowerCase()) {
          unit = this.types[prop];
          break;
        }
      }
    }
    return unit;
  }
}
