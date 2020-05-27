import { Component, Input } from '@angular/core';
import { Player } from 'src/app/classes/Player';

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss']
})
export class InformationPanelComponent {
  @Input() player: Player;

  activeTab = 'inventory';
}
