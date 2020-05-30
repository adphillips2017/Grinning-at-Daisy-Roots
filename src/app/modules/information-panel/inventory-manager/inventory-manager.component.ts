import { Component, Input } from '@angular/core';
import { Player } from 'src/app/classes/Player';

@Component({
  selector: 'app-inventory-manager',
  templateUrl: './inventory-manager.component.html',
  styleUrls: ['./inventory-manager.component.scss']
})
export class InventoryManagerComponent {
  @Input() player: Player;
}
