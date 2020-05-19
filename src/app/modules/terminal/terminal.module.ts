import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalDisplayModule } from './terminal-display/terminal-display.module';
import { TerminalInputModule } from './terminal-input/terminal-input.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TerminalDisplayModule,
    TerminalInputModule
  ],
  exports: [
    TerminalDisplayModule,
    TerminalInputModule
  ]
})
export class TerminalModule { }
