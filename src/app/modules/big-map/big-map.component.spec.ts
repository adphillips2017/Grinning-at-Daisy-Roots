import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigMapComponent } from './big-map.component';

describe('BigMapComponent', () => {
  let component: BigMapComponent;
  let fixture: ComponentFixture<BigMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
