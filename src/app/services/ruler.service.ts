import { Injectable } from '@angular/core';
import {Orientation} from '../shared/enums/orientation.enum';
import {RulerMode} from '../shared/enums/rulermode.enum';
import {Alignment} from '../shared/enums/alignment.enum';
import {RulerType} from '../shared/enums/rulertype.enum';
import {Range} from '../shared/range';
import {Theme} from '../shared/enums/theme.enum';

export interface IRulerSettings {
  theme:              Theme;
  orientation:        Orientation;
  rulerMode:          RulerMode;
  rulerType:          RulerType;
  hTextAlignment:     Alignment;
  vTextAlignment:     Alignment;
  hatchPlacement:     Alignment;
  defaultSize:        number;
  offsetWidth:        number;
  offsetHeight:       number;
  range:              Range;
  defaultFontSize:    number;
}

@Injectable()
export class RulerService implements IRulerSettings {
  theme:              Theme           = Theme.Wood_WhiteWashed;
  orientation:        Orientation     = Orientation.Horizontal;
  rulerMode:          RulerMode       = RulerMode.Responsive;
  rulerType:          RulerType       = RulerType.Double;
  hTextAlignment:     Alignment       = Alignment.Center;
  vTextAlignment:     Alignment       = Alignment.Center;
  hatchPlacement:     Alignment       = Alignment.Top;
  defaultSize:        number          = 24;
  offsetWidth:        number          = 0;
  offsetHeight:       number          = 0;
  range:              Range           = new Range(0,0);
  defaultFontSize:    number          = 11;
}
