import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2RulerComponent } from './app.component';

@NgModule({
  declarations: [
    Ng2RulerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [Ng2RulerComponent]
})
export class Ng2RulerModule { }
