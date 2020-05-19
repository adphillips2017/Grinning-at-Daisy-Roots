import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalDisplayComponent } from './terminal-display.component';

describe('TerminalDisplayComponent', () => {
  let component: TerminalDisplayComponent;
  let fixture: ComponentFixture<TerminalDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
