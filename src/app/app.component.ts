import 'hammerjs';

import { Component, ElementRef, OnInit }  from '@angular/core';
import { DomSanitizer  } from '@angular/platform-browser';
// import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { Orientation }                                    from './shared/orientation.enum';
import { RulerType }                                      from './shared/rulertype.enum';
import { range }                                          from './shared/index';
import { TimeUnit, MetricUnit, ImperialUnit, MediaUnit }  from './shared/unit.enum';
import {RulerMode}                                        from './shared/rulermode.enum';
import {Theme}                                            from './shared/theme.enum';
import {Alignment}                                        from './shared/alignment.enum';

@Component({
  selector: 'ng2-ruler',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.less'],
  host: {
    '(mousemove)': 'onHostMouseMove($event)',
    '(panleft)': 'onHostPan($event)',
    '(panright)': 'onHostPan($event)',
    '(panup)': 'onHostPan($event)',
    '(pandown)': 'onHostPan($event)',
    '(panstart)': 'onHostPanStart($event)',
    '(panend)': 'onHostPanEnd($event)',
    '(mousewheel)': 'onHostMouseWheel($event)'
  }
})
export class Ng2RulerComponent implements OnInit {
  orientation:        Orientation     = Orientation.Horizontal;
  rulerType:          RulerType       = RulerType.Double;
  tickPlacement:      Alignment       = Alignment.Top;
  unitType:           any             = TimeUnit.Seconds;
  rulerMode:          RulerMode       = RulerMode.Responsive;
  hTextAlignment:     Alignment       = Alignment.Center;
  vTextAlignment:     Alignment       = Alignment.Center;
  theme:              Theme           = Theme.Wood_WhiteWashed;
  defaultSize:        number          = 24;
  pixelsPerNUnit:     number          = 200;
  unitsPerRange:      number          = 20;
  hatchMarksPerNUnit: number          = 10;
  width:              string          = '0px';
  height:             string          = '0px';
  fontSize:           number          = 11;
  hatchSize:          number          = this.defaultSize / 5;
  unitSize:           number          = this.defaultSize / 3;
  hatchRange:         Array<number>   = [];
  unitRange:          Array<number>   = [];
  range:              any             = { start: 0, end: 500 };
  pHelperXPos:        number          = 0;
  pHelperYPos:        number          = 0;
  pHelperHeight:      number          = 0;
  pHelperWidth:       number          = 0;
  pHelperTitle:       number          = 0;
  pHelperTitleXPos:   number          = 0;
  pHelperTitleYPos:   number          = 0;
  showPHelper:        boolean         = true;
  panning:            boolean         = false;
  panDelta:           number          = 0;
  pPanDelta:          number          = 0;
  allowDragPan:       boolean         = true;
  allowWheelPan:      boolean         = true;
  showHatching:       boolean         = true;
  hasBackground:      boolean         = false;

  constructor (private elementRef: ElementRef, private sanitizer: DomSanitizer) {
  }

  ngOnInit () {
    this.initSize();
    this.initDefaults();
    this.initRange();
    this.initPHelper();
    this.initCursor();

    let self = this;
    window.addEventListener('resize', () => {
      self.initSize();
      self.initRange();
      self.initCursor();
    });
  }

  initInput () {
    // todo: implement me!
  }

  initDefaults () {
      if (this.hTextAlignment === Alignment.Top) {
          this.hTextAlignment = Alignment.Left;
      } else if (this.hTextAlignment === Alignment.Bottom) {
          this.hTextAlignment = Alignment.Right;
      } if (this.vTextAlignment === Alignment.Left) {
          this.vTextAlignment = Alignment.Top;
      } else if (this.vTextAlignment === Alignment.Right) {
          this.vTextAlignment = Alignment.Bottom;
      }

      if (this.theme > 1) {
          this.hasBackground = true;
      }
  }

  initSize () {
    if (this.orientation === Orientation.Horizontal && this.rulerMode === RulerMode.Responsive) {
      this.width = '100%';
      this.height = (this.rulerType == RulerType.Single) ? this.defaultSize + 'px' : (this.defaultSize * 2) + 'px';
    } else if (this.orientation === Orientation.Horizontal && this.rulerMode === RulerMode.Grow) {
      this.width = (this.range.end * this.pixelsPerNUnit) / this.unitsPerRange + 'px';
      this.height = (this.rulerType == RulerType.Single) ? this.defaultSize + 'px' : (this.defaultSize * 2) + 'px';
    } else if (this.orientation === Orientation.Vertical && this.rulerMode === RulerMode.Responsive) {
      this.height = '100%';
      this.width = (this.rulerType == RulerType.Single) ? this.defaultSize + 'px' : (this.defaultSize * 2) + 'px';
    } else {
        this.height = (this.range.end * this.pixelsPerNUnit) / this.unitsPerRange + 'px';
        this.width = (this.rulerType == RulerType.Single) ? this.defaultSize + 'px' : (this.defaultSize * 2) + 'px';
    }

    this.elementRef.nativeElement.style.width = this.width;
    this.elementRef.nativeElement.style.height = this.height;
  }

  initRange () {
    let offsetWidth = this.elementRef.nativeElement.offsetWidth;
    let offsetHeight = this.elementRef.nativeElement.offsetHeight;

    if (this.orientation === Orientation.Horizontal && this.rulerMode === RulerMode.Responsive) {
      this.hatchRange = range(this.range.start, offsetWidth, this.hatchMarksPerNUnit);
      this.unitRange = range(this.range.start, offsetWidth, this.pixelsPerNUnit);
    } else if (this.orientation === Orientation.Vertical && this.rulerMode === RulerMode.Responsive) {
      this.hatchRange = range(this.range.start, offsetHeight, this.hatchMarksPerNUnit);
      this.unitRange = range(this.range.start, offsetHeight, this.pixelsPerNUnit);
    } else {
      let endRange = ((this.range.end * this.pixelsPerNUnit) + this.pixelsPerNUnit) / this.unitsPerRange;
      this.hatchRange = range(this.range.start, endRange, this.hatchMarksPerNUnit);
      this.unitRange = range(this.range.start, endRange , this.pixelsPerNUnit);
    }
  }

  initCursor () {
      let offsetHeight = this.elementRef.nativeElement.offsetHeight;
      let offsetWidth = this.elementRef.nativeElement.offsetWidth;
      let endRange = (this.range.end * this.pixelsPerNUnit) / this.unitsPerRange;

      if (this.orientation === Orientation.Horizontal && endRange > offsetWidth ||
          this.orientation === Orientation.Vertical && endRange > offsetHeight) {
          this.elementRef.nativeElement.querySelector('svg').style.cursor = '-webkit-grabbing';
      }
  }

  initPHelper () {
    this.pHelperHeight = (this.rulerType == RulerType.Double) ? this.defaultSize * 2 : this.defaultSize;
    this.pHelperWidth = (this.rulerType == RulerType.Double) ? this.defaultSize * 2 : this.defaultSize;

    let fontSplit = this.fontSize / 4;
    let sizeHalf = (this.defaultSize * 2) / 2;
    if (this.orientation == Orientation.Horizontal) {
      this.pHelperTitleYPos = (this.rulerType == RulerType.Double) ? sizeHalf + fontSplit : (this.defaultSize / 2) + fontSplit
    } else {
      this.pHelperTitleXPos = (this.rulerType == RulerType.Double) ? sizeHalf - this.fontSize : 1;
    }
  }

  isHorizontal () {
    return (this.orientation === Orientation.Horizontal) ? true : false;
  }

  calcMultiTitleY (index, value) {
    let offset = 0;
    let offsetHeight = this.elementRef.nativeElement.offsetHeight;
    let unit = (this.unitsPerRange) * value / this.pixelsPerNUnit;

    if (this.orientation === Orientation.Vertical) {
        if (this.rulerMode === RulerMode.Grow && unit == this.range.end || this.rulerMode === RulerMode.Responsive && value == offsetHeight) {
            let negIndex = (index == 0) ? -1 : index - 1;
            offset = negIndex * this.fontSize;
        } else {
            offset = ((index + 1) * this.fontSize);
        }
    }

    return value + offset;
  }

  generateVerticalText (value) {
    var newValue = this.unitsPerRange * value / this.pixelsPerNUnit;
    var lines = newValue.toString().split('');
    return lines;
  }

  onHostMouseMove (event) {
      if (!this.panning && event.target.tagName == 'svg') {
          let position = (this.orientation === Orientation.Horizontal) ? event.offsetX : event.offsetY;
          let unit =  (this.unitsPerRange) * (position - this.panDelta) / this.pixelsPerNUnit;
          this.pHelperXPos = (this.orientation === Orientation.Horizontal) ? event.offsetX - this.panDelta: 0;
          this.pHelperYPos = (this.orientation === Orientation.Vertical) ? event.offsetY - this.panDelta: 0;
          this.pHelperTitle = unit;
      }
  }

  onHostPan (event) {
      if (this.panning) {
          let offsetHeight = this.elementRef.nativeElement.offsetHeight;
          let offsetWidth = this.elementRef.nativeElement.offsetWidth;
          let endRange = (this.range.end * this.pixelsPerNUnit) / this.unitsPerRange;
          let widthDiff = endRange - offsetWidth;
          let heightDiff = endRange - offsetHeight;
          let deltaX = this.range.start - (this.pPanDelta + event.deltaX);
          let deltaY = this.range.start - (this.pPanDelta + event.deltaY);

          if (this.orientation === Orientation.Horizontal) {
              if (endRange > offsetWidth && -(deltaX) < widthDiff && -(deltaX) > this.range.start){
                  this.hatchRange = range(this.range.start, endRange, this.hatchMarksPerNUnit);
                  this.unitRange = range(this.range.start, endRange, this.pixelsPerNUnit);
                  this.panDelta = deltaX ;
              } else if (-(deltaX) < this.range.start){
                  this.panDelta = this.range.start;
              } else if (endRange < offsetWidth) {
                  this.panDelta = this.range.end;
              }
          } else if (this.orientation === Orientation.Vertical) {
              if (endRange > offsetHeight && -(deltaY) < heightDiff && -(deltaY) > this.range.start) {
                  this.hatchRange = range(this.range.start, endRange, this.hatchMarksPerNUnit);
                  this.unitRange = range(this.range.start, endRange, this.pixelsPerNUnit);
                  this.panDelta = deltaY;
              }  else if (-(deltaY) < this.range.start){
                  this.panDelta = this.range.start;
              } else if (endRange < offsetHeight) {
                  this.panDelta = this.range.end;
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
          let delta = (event.deltaY < 100) ? this.unitsPerRange : -this.unitsPerRange;
          if (this.orientation === Orientation.Horizontal) {
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
      if (this.orientation === Orientation.Horizontal) {
          style = 'transform: translateX(' + this.panDelta + 'px)';
      } else {
          style = 'transform: translateY(' + this.panDelta + 'px)';
      }

      let sanitizedStyle = this.sanitizer.bypassSecurityTrustStyle(style);
      return sanitizedStyle;
  }

  getMultiLineTitleTranslation (value, titleElm) {
      let style = '';
      if (this.orientation === Orientation.Vertical) {
          let y = 0;
          if (this.vTextAlignment === Alignment.Bottom || value == this.range.start) {
              y = 5;
          } else if (this.vTextAlignment === Alignment.Top) {
              y = -titleElm.clientHeight - 5;
          } else if (this.vTextAlignment === Alignment.Center) {
              y = -(titleElm.clientHeight / 2);
          }

          let single = 0;
          let double = 0;
          if (this.hTextAlignment === Alignment.Left) {
              single = titleElm.clientWidth;
              double = single;
          } else if (this.hTextAlignment === Alignment.Right) {
              single = this.defaultSize - (titleElm.clientWidth * 2);
              double = (this.defaultSize * 2) - (titleElm.clientWidth * 2);
          } else if (this.hTextAlignment === Alignment.Center) {
              single = (this.defaultSize / 2) - (titleElm.clientWidth / 2);
              double = ((this.defaultSize * 2) / 2) - (titleElm.clientWidth / 2);
          }
          let x = (this.rulerType === RulerType.Single) ? single : double;
          style = 'transform: translate('+ x + 'px,' + y + 'px)';
      }

      let sanitizedStyle = this.sanitizer.bypassSecurityTrustStyle(style);
      return sanitizedStyle;
  }

  getTitleTranslation (value, titleElm) {
      let style = '';
      if (this.orientation == Orientation.Horizontal) {
          let x = 0;
          let offsetWidth = this.elementRef.nativeElement.offsetWidth;
          let unit = (this.unitsPerRange) * value / this.pixelsPerNUnit;

          if (this.rulerMode === RulerMode.Grow && unit == this.range.end || this.rulerMode === RulerMode.Responsive && value == offsetWidth) {
              x = -titleElm.clientWidth - 5;
          } else if (unit == this.range.start || this.hTextAlignment === Alignment.Right) {
              x = 5;
          } else if (this.hTextAlignment === Alignment.Left) {
              x = -titleElm.clientWidth - 5;
          } else if (this.hTextAlignment === Alignment.Center) {
              x = -(titleElm.clientWidth / 2);
          }

          let single = 0;
          let double = 0;
          if (this.vTextAlignment === Alignment.Top) {
              single = this.defaultSize - this.fontSize;
              double = single;
          } else if (this.vTextAlignment === Alignment.Center) {
              single = (this.defaultSize - this.fontSize) + (this.fontSize / 4);
              double = (this.defaultSize * 2) / 2 + (this.fontSize / 4);
          } else if (this.vTextAlignment === Alignment.Bottom) {
              single = this.defaultSize - (this.fontSize / 2);
              double = (this.defaultSize * 2) - (this.fontSize / 2);
          }

          let y = (this.rulerType === RulerType.Single) ? single : double;
          style = 'transform: translate(' + (value + x) + 'px,' + y + 'px)';
      }
      let sanitizedStyle = this.sanitizer.bypassSecurityTrustStyle(style);
      return sanitizedStyle;
  }

  getThemeClassName () {
      return Theme[this.theme].toLowerCase();
  }
}
