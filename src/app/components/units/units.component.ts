import {Component, OnInit} from '@angular/core';
import { DomSanitizer  } from '@angular/platform-browser';

import {Unit} from '../../services/units.service';
import {RulerService} from '../../services/ruler.service';
import {Orientation} from '../../shared/enums/orientation.enum';
import {Alignment} from '../../shared/enums/alignment.enum';
import {RulerType} from '../../shared/enums/rulertype.enum';
import {RulerMode} from '../../shared/enums/rulermode.enum';
import {Line} from '../../shared/line';
import {Theme} from '../../shared/enums/theme.enum';
import {range} from "../../shared/range";

@Component({
  selector: '[ng2-ruler-units]',
  templateUrl: './units.component.pug',
  styleUrls: ['./units.component.less'],
  inputs: ['unit', 'parentUnit']
})
export class UnitsComponent implements OnInit {
  unit: Unit;
  parentUnit: Unit;
  lines: Array<Line> = [];
  mirroredLines: Array<Line> = [];

  constructor(private rulerService: RulerService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.initRange();
  }

  initRange () {
    let parentEndRange = (this.parentUnit) ? (this.rulerService.range.end * this.parentUnit.pixelsPerNUnit) / this.parentUnit.unitsPerRange : undefined;
    let endRange = (!parentEndRange) ? (this.rulerService.range.end * this.unit.pixelsPerNUnit) / this.unit.unitsPerRange : parentEndRange;
    let lrange = [];
    if (this.rulerService.orientation === Orientation.Horizontal &&
      ((this.rulerService.rulerMode === RulerMode.Responsive && endRange < this.rulerService.offsetWidth)  || this.rulerService.rulerMode === RulerMode.Fit)) {
      lrange = range(this.rulerService.range.start, this.rulerService.offsetWidth, this.unit.pixelsPerNUnit);
    } else if (this.rulerService.orientation === Orientation.Vertical &&
      ((this.rulerService.rulerMode === RulerMode.Responsive && endRange < this.rulerService.offsetHeight)  || this.rulerService.rulerMode === RulerMode.Fit))  {
      lrange = range(this.rulerService.range.start, this.rulerService.offsetHeight, this.unit.pixelsPerNUnit);
    } else {
      lrange = range(this.rulerService.range.start, endRange , this.unit.pixelsPerNUnit);
    }
    this.generateLines(lrange);
  }

  generateLines (lrange: Array<number>) {
    if (lrange.length != this.lines.length) {
      this.lines = [];
      this.mirroredLines = [];
      lrange.forEach(value => {
        let x1 = (this.rulerService.orientation === Orientation.Horizontal) ? value : 0;
        let x2 = (this.rulerService.orientation === Orientation.Horizontal) ? value : this.unit.hatchSize;
        let y1 = (this.rulerService.orientation === Orientation.Vertical) ? value : 0;
        let y2 =  (this.rulerService.orientation === Orientation.Vertical) ? value : this.unit.hatchSize;

        let mx1 = (this.rulerService.orientation === Orientation.Horizontal) ? value : this.rulerService.defaultSize * 2;
        let mx2 = (this.rulerService.orientation === Orientation.Horizontal) ? value : this.rulerService.defaultSize * 2 - this.unit.hatchSize;
        let my1 = (this.rulerService.orientation === Orientation.Vertical) ? value : this.rulerService.defaultSize * 2;
        let my2 = (this.rulerService.orientation === Orientation.Vertical) ? value : this.rulerService.defaultSize * 2 - this.unit.hatchSize;

        if (this.rulerService.rulerType === RulerType.Single && this.rulerService.orientation === Orientation.Horizontal &&
          this.rulerService.hatchPlacement === Alignment.Bottom) {
          y1 = this.rulerService.defaultSize;
          y2 = this.rulerService.defaultSize - this.unit.hatchSize;
        } else if (this.rulerService.rulerType === RulerType.Single && this.rulerService.orientation === Orientation.Vertical
          && this.rulerService.hatchPlacement === Alignment.Right) {
          x1 = this.rulerService.defaultSize;
          x2 = this.rulerService.defaultSize - this.unit.hatchSize;
        }
        let line = new Line(x1, x2, y1, y2);
        this.lines.push(line);

        let mirroredLine = new Line(mx1, mx2, my1, my2);
        this.mirroredLines.push(mirroredLine);
      });
    }
  }

  formatTitle (value) {
    let newValue = (this.unit.unitsPerRange) * value / this.unit.pixelsPerNUnit;
    newValue = Math.round(newValue * 100) / 100;
    let formated = newValue.toString();
    if (this.unit.showUnitSymbols) {
      formated += ' ' + this.unit.symbol;
    }
    return formated;
  }

  getMultiLineTitleTranslation (value, titleElm) {
    let style = '';
    if (this.rulerService.orientation === Orientation.Vertical) {
      let y = 0;
      if (this.rulerService.vTextAlignment === Alignment.Bottom || value == this.rulerService.range.start) {
        y = 5;
      } else if (this.rulerService.vTextAlignment === Alignment.Top) {
        y = -titleElm.clientHeight - 5;
      } else if (this.rulerService.vTextAlignment === Alignment.Center) {
        y = -(titleElm.clientHeight / 2);
      }

      let single = 0;
      let double = 0;
      if (this.rulerService.hTextAlignment === Alignment.Left) {
        single = titleElm.clientWidth;
        double = single;
      } else if (this.rulerService.hTextAlignment === Alignment.Right) {
        single = this.rulerService.defaultSize - (titleElm.clientWidth * 2);
        double = (this.rulerService.defaultSize * 2) - (titleElm.clientWidth * 2);
      } else if (this.rulerService.hTextAlignment === Alignment.Center) {
        single = (this.rulerService.defaultSize / 2) - (titleElm.clientWidth / 2);
        double = ((this.rulerService.defaultSize * 2) / 2) - (titleElm.clientWidth / 2);
      }
      let x = (this.rulerService.rulerType === RulerType.Single) ? single : double;
      style = 'transform: translate('+ x + 'px,' + y + 'px)';
    }

    let sanitizedStyle = this.sanitizer.bypassSecurityTrustStyle(style);
    return sanitizedStyle;
  }

  getTitleTranslation (value, titleElm) {
    let style = '';
    if (this.rulerService.orientation == Orientation.Horizontal) {
      let x = 0;
      let offsetWidth = this.rulerService.offsetWidth;
      let unit = (this.unit.unitsPerRange) * value / this.unit.pixelsPerNUnit;
      let parentEndRange = (this.parentUnit) ? (this.rulerService.range.end * this.parentUnit.pixelsPerNUnit) / this.parentUnit.unitsPerRange : undefined;
      let endRange = (!parentEndRange) ? (this.rulerService.range.end * this.unit.pixelsPerNUnit) / this.unit.unitsPerRange : parentEndRange;

      if (this.rulerService.rulerMode === RulerMode.Grow && unit == this.rulerService.range.end ||
        this.rulerService.rulerMode === RulerMode.Responsive && value == offsetWidth && endRange < offsetWidth ||
        this.rulerService.rulerMode === RulerMode.Responsive && unit == endRange) {
        x = -titleElm.clientWidth - 5;
      } else if (unit == this.rulerService.range.start || this.rulerService.hTextAlignment === Alignment.Right) {
        x = 5;
      } else if (this.rulerService.hTextAlignment === Alignment.Left) {
        x = -titleElm.clientWidth - 5;
      } else if (this.rulerService.hTextAlignment === Alignment.Center) {
        x = -(titleElm.clientWidth / 2);
      }

      let single = 0;
      let double = 0;
      if (this.rulerService.vTextAlignment === Alignment.Top) {
        single = this.rulerService.defaultSize - this.unit.fontSize;
        double = single;
      } else if (this.rulerService.vTextAlignment === Alignment.Center) {
        single = (this.rulerService.defaultSize - this.unit.fontSize) + (this.unit.fontSize / 4);
        double = (this.rulerService.defaultSize * 2) / 2 + (this.unit.fontSize / 4);
      } else if (this.rulerService.vTextAlignment === Alignment.Bottom) {
        single = this.rulerService.defaultSize - (this.unit.fontSize / 2);
        double = (this.rulerService.defaultSize * 2) - (this.unit.fontSize / 2);
      }

      let y = (this.rulerService.rulerType === RulerType.Single) ? single : double;
      style = 'transform: translate(' + (value + x) + 'px,' + y + 'px)';
    }
    let sanitizedStyle = this.sanitizer.bypassSecurityTrustStyle(style);
    return sanitizedStyle;
  }

  calcMultiTitleY (index, value) {
    let offset = 0;
    let offsetHeight = this.rulerService.offsetHeight;
    let unit = (this.unit.unitsPerRange) * value / this.unit.pixelsPerNUnit;

    if (this.rulerService.orientation === Orientation.Vertical) {
      if (this.rulerService.rulerMode === RulerMode.Grow && unit == this.rulerService.range.end || this.rulerService.rulerMode === RulerMode.Responsive && value == offsetHeight) {
        let negIndex = (index == 0) ? -1 : index - 1;
        offset = negIndex * this.unit.fontSize;
      } else {
        offset = ((index + 1) * this.unit.fontSize);
      }
    }

    return value + offset;
  }

  isHorizontal () {
    return (this.rulerService.orientation === Orientation.Horizontal) ? true : false;
  }

  generateVerticalText (value) {
    var newValue = this.unit.unitsPerRange * value / this.unit.pixelsPerNUnit;
    var lines = newValue.toString().split('');
    if (this.unit.showUnitSymbols) {
      lines.push(this.unit.symbol);
    }
    return lines;
  }

  getThemeClassName () {
    return Theme[this.rulerService.theme].toLowerCase();
  }
}
