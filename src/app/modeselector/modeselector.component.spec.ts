import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeselectorComponent } from './modeselector.component';

describe('ModeselectorComponent', () => {
  let component: ModeselectorComponent;
  let fixture: ComponentFixture<ModeselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeselectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
