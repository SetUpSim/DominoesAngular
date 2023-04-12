import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DominoeTileComponent } from './dominoe-tile.component';

describe('DominoeTileComponent', () => {
  let component: DominoeTileComponent;
  let fixture: ComponentFixture<DominoeTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DominoeTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DominoeTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
