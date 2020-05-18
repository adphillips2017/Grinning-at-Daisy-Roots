import { Component } from '@angular/core';
import { User } from 'src/app/classes/User';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent {
  user: User = new User();
}
