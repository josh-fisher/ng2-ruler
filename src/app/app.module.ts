import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2RulerComponent } from './components/app.component';
import { Units } from './services/units.service';

@NgModule({
  declarations: [
    Ng2RulerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Units],
  bootstrap: [Ng2RulerComponent]
})
export class Ng2RulerModule { }
