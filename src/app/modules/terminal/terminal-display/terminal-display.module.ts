import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalDisplayComponent } from './terminal-display.component';



@NgModule({
  declarations: [TerminalDisplayComponent],
  imports: [CommonModule],
  exports: [TerminalDisplayComponent]
})
export class TerminalDisplayModule { }
