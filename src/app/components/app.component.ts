import 'hammerjs';

import {Component, ElementRef, OnInit}  from '@angular/core';
import { DomSanitizer  } from '@angular/platform-browser';

import { Orientation }                                    from '../shared/enums/orientation.enum';
import { RulerType }                                      from '../shared/enums/rulertype.enum';
import {RulerMode}                                        from '../shared/enums/rulermode.enum';
import {Theme}                                            from '../shared/enums/theme.enum';
import {Alignment}                                        from '../shared/enums/alignment.enum';
import {RulerService}     from '../services/ruler.service';
import {UnitType} from '../shared/enums/unit.enum';
import {Unit, UnitsService} from '../services/units.service';
import {range} from "../shared/range";
import {Line} from "../shared/line";

@Component({
  selector: 'ng2-ruler',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.less'],
  host: {
    '(mousemove)':  'onHostMouseMove($event)',
    '(panleft)':    'onHostPan($event)',
    '(panright)':   'onHostPan($event)',
    '(panup)':      'onHostPan($event)',
    '(pandown)':    'onHostPan($event)',
    '(panstart)':   'onHostPanStart($event)',
    '(panend)':     'onHostPanEnd($event)',
    '(mousewheel)': 'onHostMouseWheel($event)'
  },
  inputs: ['unitType', 'unit', 'orientation', 'rulerMode', 'rulerType',
    'hTextAlignment', 'vTextAlignment', 'hatchPlacement', 'defaultSize',
    'defaultFontSize', 'range', 'theme']
})
export class Ng2RulerComponent implements OnInit {
  unitType:                   UnitType        = UnitType.Inches;
  rulerService:               RulerService;

  private unit:               Unit;
  private hatchUnits:         Array<Unit>     = [];
  private width:              string          = '0px';
  private height:             string          = '0px';
  private pHelperTitle:       string          = '';
  private pHelperTitlePos:    any             = {x1:0, y1:0};
  private pHelperLine:        Line            = new Line(0,0,0,0);
  private showPHelper:        boolean         = true;
  private panning:            boolean         = false;
  private panDelta:           number          = 0;
  private pPanDelta:          number          = 0;
  private allowDragPan:       boolean         = true;
  private allowWheelPan:      boolean         = true;
  private hasBackground:      boolean         = false;

  constructor (private elementRef: ElementRef, private sanitizer: DomSanitizer,
               private unitsService: UnitsService, rulerService: RulerService) {
    this.rulerService = rulerService;
  }

  ngOnInit () {
    this.initUnits();
    this.initSize();
    this.initDefaults();
    this.initPHelper();

    let self = this;
    window.addEventListener('resize', () => {
      self.initSize();
    });
  }

  /*
  initInput () {
    this.rulerService.orientation = (this.orientation) ? this.orientation : Orientation.Horizontal;
    this.rulerService.rulerMode = (this.rulerMode) ? this.rulerMode : RulerMode.Responsive;
    this.rulerService.rulerType = (this.rulerType) ? this.rulerType : RulerType.Double;
    this.rulerService.hTextAlignment = (this.hTextAlignment) ? this.hTextAlignment : Alignment.Center;
    this.rulerService.vTextAlignment = (this.vTextAlignment) ? this.vTextAlignment : Alignment.Center;
    this.rulerService.hatchPlacement = (this.hatchPlacement) ? this.hatchPlacement : Alignment.Bottom;
    this.rulerService.defaultSize = (this.defaultSize) ? this.defaultSize : 24;
    this.rulerService.fontSize = (this.fontSize) ? this.fontSize : 11;
    this.rulerService.hatchSize = (this.hatchSize) ? this.hatchSize : this.defaultSize / 3;
    this.rulerService.range = (this.range && this.range.length == 2) ? new Range(this.range[0], this.range[1]) : new Range(0, 12);
  }
  */

  initUnits () {
    this.unit = this.unitsService.getUnit(this.unitType);
    this.hatchUnits = (this.hatchUnits) ? this.hatchUnits : this.unit.hatchUnits;
  }

  initDefaults () {
      if (this.rulerService.hTextAlignment === Alignment.Top) {
          this.rulerService.hTextAlignment = Alignment.Left;
      } else if (this.rulerService.hTextAlignment === Alignment.Bottom) {
          this.rulerService.hTextAlignment = Alignment.Right;
      } if (this.rulerService.vTextAlignment === Alignment.Left) {
          this.rulerService.vTextAlignment = Alignment.Top;
      } else if (this.rulerService.vTextAlignment === Alignment.Right) {
          this.rulerService.vTextAlignment = Alignment.Bottom;
      }

      if (this.rulerService.orientation === Orientation.Horizontal && this.rulerService.hatchPlacement === Alignment.Right) {
        this.rulerService.hatchPlacement = Alignment.Bottom;
      } else if (this.rulerService.orientation === Orientation.Horizontal && this.rulerService.hatchPlacement === Alignment.Left) {
          this.rulerService.hatchPlacement = Alignment.Top;
      } else if (this.rulerService.hatchPlacement !== Alignment.Top && this.rulerService.hatchPlacement !== Alignment.Bottom) {
          this.rulerService.hatchPlacement = Alignment.Top;
      } else if (this.rulerService.orientation === Orientation.Vertical && this.rulerService.hatchPlacement === Alignment.Top) {
        this.rulerService.hatchPlacement = Alignment.Left;
      } else if (this.rulerService.orientation === Orientation.Vertical && this.rulerService.hatchPlacement === Alignment.Bottom) {
        this.rulerService.hatchPlacement = Alignment.Right;
      }

      if (this.rulerService.theme > 1) {
          this.hasBackground = true;
      }
  }

  initSize () {
    if (this.rulerService.orientation === Orientation.Horizontal && (this.rulerService.rulerMode === RulerMode.Responsive || this.rulerService.rulerMode === RulerMode.Fit)) {
      this.width = '100%';
      this.height = (this.rulerService.rulerType == RulerType.Single) ? this.rulerService.defaultSize + 'px' : (this.rulerService.defaultSize * 2) + 'px';
    } else if (this.rulerService.orientation === Orientation.Horizontal && this.rulerService.rulerMode === RulerMode.Grow) {
      this.width = (this.rulerService.range.end * this.unit.pixelsPerNUnit) / this.unit.unitsPerRange + 'px';
      this.height = (this.rulerService.rulerType == RulerType.Single) ? this.rulerService.defaultSize + 'px' : (this.rulerService.defaultSize * 2) + 'px';
    } else if (this.rulerService.orientation === Orientation.Vertical && this.rulerService.rulerMode === RulerMode.Responsive) {
      this.height = '100%';
      this.width = (this.rulerService.rulerType == RulerType.Single) ? this.rulerService.defaultSize + 'px' : (this.rulerService.defaultSize * 2) + 'px';
    } else {
        this.height = (this.rulerService.range.end * this.unit.pixelsPerNUnit) / this.unit.unitsPerRange + 'px';
        this.width = (this.rulerService.rulerType == RulerType.Single) ? this.rulerService.defaultSize + 'px' : (this.rulerService.defaultSize * 2) + 'px';
    }

    this.elementRef.nativeElement.style.width = this.width;
    this.elementRef.nativeElement.style.height = this.height;
    this.rulerService.offsetWidth = this.elementRef.nativeElement.offsetWidth;
    this.rulerService.offsetHeight = this.elementRef.nativeElement.offsetHeight;
  }

  initPHelper () {
    if (this.rulerService.rulerType === RulerType.Double) {
      this.pHelperLine.x1 = (this.rulerService.orientation === Orientation.Vertical) ?  0 : 0;
      this.pHelperLine.x2 = (this.rulerService.orientation === Orientation.Vertical) ?  this.rulerService.defaultSize * 2 : 0;
      this.pHelperLine.y1 = (this.rulerService.orientation === Orientation.Horizontal) ? 0 : 0;
      this.pHelperLine.y2 = (this.rulerService.orientation === Orientation.Horizontal) ? this.rulerService.defaultSize * 2 : 0;
    } else {
      this.pHelperLine.x1 = (this.rulerService.orientation === Orientation.Vertical) ?  0 : 0;
      this.pHelperLine.x2 = (this.rulerService.orientation === Orientation.Vertical) ?  this.rulerService.defaultSize : 0;
      this.pHelperLine.y1 = (this.rulerService.orientation === Orientation.Horizontal) ? 0 : 0;
      this.pHelperLine.y2 = (this.rulerService.orientation === Orientation.Horizontal) ? this.rulerService.defaultSize : 0;
    }
  }

  onHostMouseMove (event) {
      if (!this.panning && event.target.tagName == 'svg') {
        this.pHelperLine.y1 = (this.rulerService.orientation === Orientation.Vertical) ?  event.offsetY : 0;
        this.pHelperLine.y2 = (this.rulerService.orientation === Orientation.Vertical) ?  event.offsetY : this.pHelperLine.x2;
        this.pHelperLine.x1 = (this.rulerService.orientation === Orientation.Horizontal) ? event.offsetX : 0;
        this.pHelperLine.x2 = (this.rulerService.orientation === Orientation.Horizontal) ? event.offsetX : this.pHelperLine.y2;

        let single = (this.rulerService.defaultSize - this.unit.fontSize) + (this.unit.fontSize / 4);
        let double = (this.rulerService.defaultSize * 2) / 2 + (this.unit.fontSize / 4);
        if (this.rulerService.orientation === Orientation.Horizontal) {
          this.pHelperTitlePos.x1 = this.pHelperLine.x1 + 5;
          this.pHelperTitlePos.y1 = (this.rulerService.rulerType === RulerType.Single) ? single : double;
        } else {
          this.pHelperTitlePos.x1 = (this.rulerService.rulerType === RulerType.Single) ? single : double;
          this.pHelperTitlePos.y1 = this.pHelperLine.x1 + 5;
        }

        let position = (this.rulerService.orientation === Orientation.Horizontal) ? event.offsetX : event.offsetY;
        let unit = (this.unit.unitsPerRange) * (position - this.panDelta) / this.unit.pixelsPerNUnit;
        let value = Math.round(unit * 100) / 100;
        this.pHelperTitle = value.toString();
        if (this.unit.showUnitSymbols) {
          this.pHelperTitle += ' ' + this.unit.symbol;
        }
      }
  }

  onHostPan (event) {
      if (this.panning) {
          let endRange = (this.rulerService.range.end * this.unit.pixelsPerNUnit) / this.unit.unitsPerRange;
          let widthDiff = endRange - this.rulerService.offsetWidth;
          let heightDiff = endRange - this.rulerService.offsetHeight;
          let deltaX = this.rulerService.range.start - (this.pPanDelta + event.deltaX);
          let deltaY = this.rulerService.range.start - (this.pPanDelta + event.deltaY);

          if (this.rulerService.orientation === Orientation.Horizontal) {
              if (endRange > this.rulerService.offsetWidth && -(deltaX) < widthDiff && -(deltaX) > this.rulerService.range.start){
                  this.panDelta = deltaX;
              } else if (-(deltaX) < this.rulerService.range.start){
                  this.panDelta = this.rulerService.range.start;
              } else if (-(deltaX) > this.rulerService.offsetWidth) {
                  this.panDelta = -widthDiff;
              }
          } else if (this.rulerService.orientation === Orientation.Vertical) {
              if (endRange > this.rulerService.offsetHeight && -(deltaY) < heightDiff && -(deltaY) > this.rulerService.range.start) {
                  this.panDelta = deltaY;
              }  else if (-(deltaY) < this.rulerService.range.start){
                  this.panDelta = this.rulerService.range.start;
              } else if (-(deltaY) > this.rulerService.offsetHeight) {
                  this.panDelta = -heightDiff;
              }
          }
      }
  }

  onHostPanStart (event) {
      if (this.allowDragPan) {
          this.panning = true;
          this.showPHelper = false;
      }
  }

  onHostPanEnd (event) {
      this.panning = false;
      this.showPHelper = true;
      this.pPanDelta = -(this.panDelta);
  }

  onHostMouseWheel (event) {
      if (this.allowWheelPan) {
          this.panning = true;
          this.showPHelper = false;
          let delta = (event.deltaY < 100) ? this.unit.unitsPerRange : -this.unit.unitsPerRange;
          if (this.rulerService.orientation === Orientation.Horizontal) {
              this.onHostPan({deltaX: delta, deltaY: 1});
          } else {
              this.onHostPan({deltaX: 1, deltaY: delta});
          }
          this.panning = false;
          this.showPHelper = true;
          this.pPanDelta = -(this.panDelta);
      }
  }

  getPanTranslation () {
      let style = '';
      if (this.rulerService.orientation === Orientation.Horizontal) {
          style = 'transform: translateX(' + this.panDelta + 'px)';
      } else {
          style = 'transform: translateY(' + this.panDelta + 'px)';
      }

      let sanitizedStyle = this.sanitizer.bypassSecurityTrustStyle(style);
      return sanitizedStyle;
  }

  getThemeClassName () {
      let endRange = (this.rulerService.range.end * this.unit.pixelsPerNUnit) / this.unit.unitsPerRange;
      let grabbing = '';

      if (this.rulerService.orientation === Orientation.Horizontal && endRange > this.rulerService.offsetWidth ||
          this.rulerService.orientation === Orientation.Vertical && endRange > this.rulerService.offsetHeight) {
          grabbing = 'grabbing'
      }

      return Theme[this.rulerService.theme].toLowerCase() + ' ' + grabbing;
  }
}