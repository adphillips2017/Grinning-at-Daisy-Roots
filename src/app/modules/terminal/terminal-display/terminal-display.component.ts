import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-terminal-display',
  templateUrl: './terminal-display.component.html',
  styleUrls: ['./terminal-display.component.scss']
})
export class TerminalDisplayComponent {
  @Input() messages;
}
