import { TestBed } from '@angular/core/testing';

import { ComputerPlayerService } from './computer-player.service';

describe('ComputerPlayerService', () => {
  let service: ComputerPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputerPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
