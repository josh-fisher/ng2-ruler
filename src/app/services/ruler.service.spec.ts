/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RulerService } from './ruler.service';

describe('Service: Ruler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RulerService]
    });
  });

  it('should ...', inject([RulerService], (service: RulerService) => {
    expect(service).toBeTruthy();
  }));
});
