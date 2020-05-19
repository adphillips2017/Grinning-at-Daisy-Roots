import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terminal-input',
  templateUrl: './terminal-input.component.html',
  styleUrls: ['./terminal-input.component.scss']
})
export class TerminalInputComponent {
  @Output() issueCommand = new EventEmitter<string>();
  command = '';

  onSubmit(input: string): void {
    this.issueCommand.emit(input);
    this.command = '';
  }
}
