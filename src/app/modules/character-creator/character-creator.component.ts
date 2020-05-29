import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/classes/Player';

@Component({
  selector: 'app-character-creator',
  templateUrl: './character-creator.component.html',
  styleUrls: ['./character-creator.component.scss']
})
export class CharacterCreatorComponent {
  @Input() player: Player;

}
