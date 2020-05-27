import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terminal-input',
  templateUrl: './terminal-input.component.html',
  styleUrls: ['./terminal-input.component.scss']
})
export class TerminalInputComponent {
  @Output() issueCommand = new EventEmitter<string>();
  commandHistory: string[] = [];
  currentCommand = 0;
  command = '';

  onSubmit(input: string): void {
    this.commandHistory.unshift(input);
    this.issueCommand.emit(input);
    this.command = '';
    this.currentCommand = -1;

    if (this.commandHistory.length > 10) { this.commandHistory.pop(); }
  }

  getPreviousCommand(): void {
    if (this.currentCommand >= this.commandHistory.length) { return; }

    this.currentCommand++;
    this.command = this.commandHistory[this.currentCommand];
  }

  getNextCommand(): void {
    if (this.currentCommand < 0) {
      this.command = '';
      return;
    }

    this.currentCommand--;
    this.command = this.commandHistory[this.currentCommand];
  }
}
