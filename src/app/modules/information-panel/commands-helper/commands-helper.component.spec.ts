import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsHelperComponent } from './commands-helper.component';

describe('CommandsHelperComponent', () => {
  let component: CommandsHelperComponent;
  let fixture: ComponentFixture<CommandsHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandsHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandsHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
