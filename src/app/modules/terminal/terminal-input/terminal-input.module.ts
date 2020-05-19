import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalInputComponent } from './terminal-input.component';




@NgModule({
  declarations: [TerminalInputComponent],
  imports: [CommonModule, FormsModule],
  exports: [TerminalInputComponent]
})
export class TerminalInputModule { }
