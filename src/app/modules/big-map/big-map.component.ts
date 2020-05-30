import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Map } from '../../models/Map';

@Component({
  selector: 'app-big-map',
  templateUrl: './big-map.component.html',
  styleUrls: ['./big-map.component.scss']
})
export class BigMapComponent {
  @Input() map: Map;
  @Input() playerX: number;
  @Input() playerY: number;
  @Output() closeMap = new EventEmitter<any>();

  @HostListener('document:keydown', ['$event']) onKeydownHandler() {
    this.closeMap.emit();
  }
}
