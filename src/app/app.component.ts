import 'hammerjs';

import { Component, ElementRef, OnInit }  from '@angular/core';
// import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { Orientation }                                    from './shared/orientation.enum';
import { RulerType }                                      from './shared/rulertype.enum';
import { range }                                          from './shared/index';
import { TimeUnit, MetricUnit, ImperialUnit, MediaUnit }  from './shared/unit.enum';
import {RulerMode}                                        from './shared/rulermode.enum';
import {Theme}                                            from './shared/theme.enum';
import {Justify} from './shared/justify.enum';

@Component({
  selector: 'ng2-ruler',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.less'],
  host: {
    '(mousemove)': 'onHostMouseMove($event)',
    '(swipe)': 'onHostSwipe($event)',
    '(pan)': 'onHostPan($event)',
  }
})
export class Ng2RulerComponent implements OnInit {
  orientation:        Orientation     = Orientation.Horizontal;
  rulerType:          RulerType       = RulerType.Single;
  justification:      Justify         = Justify.TopOrLeft;
  unitType:           any             = TimeUnit.Seconds;
  rulerMode:          RulerMode       = RulerMode.Grow;
  theme:              Theme           = Theme.Dark;
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
  range:              any             = { start: 0, end: 60 };
  pHelperXPos:        number          = 0;
  pHelperYPos:        number          = 0;
  pHelperHeight:      number          = 0;
  pHelperWidth:       number          = 0;
  pHelperTitle:       number          = 0;
  pHelperTitleXPos:   number          = 0;
  pHelperTitleYPos:   number          = 0;

  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.initSize();
    this.initRange();
    this.initPHelper();

    let self = this;
    window.addEventListener('resize', () => {
      self.initSize();
      self.initRange();
    });
  }

  initInput () {
    // todo: implement me!
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

  calcTitleX (value) {
    let padding = 0;
    let offsetWidth = this.elementRef.nativeElement.offsetWidth;
    let unit = (this.unitsPerRange) * value / this.pixelsPerNUnit;

    if (this.orientation === Orientation.Vertical) {
      let fontSplit = this.fontSize / 4;
      let sizeHalf = (this.defaultSize * 2) / 2;
      return (this.rulerType === RulerType.Single) ? this.defaultSize - this.fontSize : sizeHalf - fontSplit;
    } else if (this.orientation === Orientation.Horizontal && this.rulerMode === RulerMode.Grow && unit == this.range.end) {
      padding = value.toString().split('').length * -(this.fontSize / 2);
    } else if (this.orientation === Orientation.Horizontal && this.rulerMode === RulerMode.Responsive && value == offsetWidth) {
      padding = value.toString().split('').length * -(this.fontSize / 2);
    }
    return value + padding;
  }

  calcTitleY (value) {
    let padding = 0;
    let offsetHeight = this.elementRef.nativeElement.offsetHeight;
    let unit = (this.unitsPerRange) * value / this.pixelsPerNUnit;

    if (this.orientation === Orientation.Horizontal) {
      let fontSplit = this.fontSize / 4;
      let sizeHalf = (this.defaultSize * 2) / 2;
      return (this.rulerType === RulerType.Single) ? this.unitSize + this.fontSize : sizeHalf + fontSplit;
    } else if (this.orientation === Orientation.Vertical && this.rulerMode === RulerMode.Grow && unit == this.range.end) {
      padding = value.toString().split('').length * -this.fontSize;
    } else if (this.orientation === Orientation.Vertical && this.rulerMode === RulerMode.Responsive && value == offsetHeight) {
      padding = value.toString().split('').length * -this.fontSize;
    } else {
      padding = value.toString().split('').length * this.fontSize;
    }
    return value + padding;
  }

  calcMultiTitleY (index, value) {
    let padding = 0;
    let offsetHeight = this.elementRef.nativeElement.offsetHeight;
    let unit = (this.unitsPerRange) * value / this.pixelsPerNUnit;

    if (this.orientation === Orientation.Vertical && this.rulerMode === RulerMode.Grow && unit == this.range.end) {
      let negIndex = (index == 0) ? -1 : index - 1;
      padding = negIndex * this.fontSize;
    } else if (this.orientation === Orientation.Vertical && this.rulerMode === RulerMode.Responsive && value == offsetHeight) {
      let negIndex = (index == 0) ? -1 : index - 1;
      padding = negIndex * this.fontSize;
    } else {
      padding = (index + 1) * this.fontSize;
    }
    return value + padding;
  }

  generateVerticalText (value) {
    var newValue = this.unitsPerRange * value / this.pixelsPerNUnit;
    var lines = newValue.toString().split('');
    return lines;
  }

  onHostMouseMove (event) {
    let position = (this.orientation === Orientation.Horizontal) ? event.offsetX : event.offsetY;
    let unit =  (this.unitsPerRange) * position / this.pixelsPerNUnit;
    this.pHelperXPos = (this.orientation === Orientation.Horizontal) ? event.offsetX : 0;
    this.pHelperYPos = (this.orientation === Orientation.Vertical) ? event.offsetY : 0;
    this.pHelperTitle = unit;
  }

  onHostSwipe (event) {
  }

  onHostPan (event) {
  }
}
