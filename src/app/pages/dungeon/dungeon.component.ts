import { Component } from '@angular/core';
import { User } from 'src/app/classes/User';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent {
  user: User = new User();
  messages = [];

  issueCommand(message: string): void {
    const userCommand = {type: 'user-input', message};
    this.messages.push(userCommand);
  }
}
