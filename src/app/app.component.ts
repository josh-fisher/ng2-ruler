import 'hammerjs';

import { Component } from '@angular/core';
// import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

@Component({
  selector: 'ng2-ruler',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.less']
})
export class Ng2RulerComponent {
  title = 'app works!';

  onSwipe (event) {
    console.log(event);
  }

  onPan (event) {
    console.log(event);
    // Test
  }
}
