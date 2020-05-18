import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/User';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit {
  user: User = new User();

  ngOnInit(): void {
  }

}
