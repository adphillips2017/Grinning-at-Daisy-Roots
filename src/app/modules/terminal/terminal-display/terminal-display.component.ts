import { Component, Input, AfterViewInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-terminal-display',
  templateUrl: './terminal-display.component.html',
  styleUrls: ['./terminal-display.component.scss']
})
export class TerminalDisplayComponent implements AfterViewInit, AfterViewChecked {
  @Input() messages;
  @ViewChild('terminal') private terminal: ElementRef;

  ngAfterViewInit(){
    this.scrollToBottom();
  }

  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.terminal.nativeElement.scrollTop = this.terminal.nativeElement.scrollHeight;
    } catch(err) {
      console.log('Error: ', err);
    }
  }
}
