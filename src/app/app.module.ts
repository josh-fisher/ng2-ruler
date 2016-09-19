import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2RulerComponent } from './components/app.component';
import {RulerService} from './services/ruler.service';
import {UnitsService} from './services/units.service';
import {UnitsComponent} from './components/units/units.component';

@NgModule({
  declarations: [
    UnitsComponent,
    Ng2RulerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [RulerService, UnitsService],
  bootstrap: [Ng2RulerComponent]
})
export class Ng2RulerModule { }
