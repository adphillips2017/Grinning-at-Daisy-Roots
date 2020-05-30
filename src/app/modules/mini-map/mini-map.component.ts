import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/classes/Player';
import { MapKey, TileKey, RoomTypesArray } from 'src/app/models/MapKey';

@Component({
  selector: 'app-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss']
})
export class MiniMapComponent implements OnInit {
  @Input() mapKey: MapKey;
  @Input() player: Player;
  emptyminiMap: MapKey = [
    ['--', '--', '--'],
    ['--', '--', '--'],
    ['--', '--', '--']
  ];
  miniMap: MapKey = this.emptyminiMap;

  ngOnInit(): void {
    this.generateMiniMap();
  }

  generateMiniMap(): void {
    const playerX = this.player.x;
    const playerY = this.player.y;

    this.miniMap[0][0] = this.tileAt(playerX - 1, playerY - 1);
    this.miniMap[0][1] = this.tileAt(playerX, playerY - 1);
    this.miniMap[0][2] = this.tileAt(playerX + 1, playerY - 1);

    this.miniMap[1][0] = this.tileAt(playerX - 1, playerY);
    this.miniMap[1][1] = this.tileAt(playerX, playerY);
    this.miniMap[1][2] = this.tileAt(playerX + 1, playerY);

    this.miniMap[2][0] = this.tileAt(playerX - 1, playerY + 1);
    this.miniMap[2][1] = this.tileAt(playerX, playerY + 1);
    this.miniMap[2][2] = this.tileAt(playerX + 1, playerY + 1);
  }

  tileIsRoom(column: string): boolean {
    if (!column) { return false; }

    return RoomTypesArray.indexOf(column) >= 0;
  }

  tileAt(x: number, y: number): TileKey {
    if (x < 0 || y < 0){ return '--'; }

    try {
      return this.mapKey[y][x];
    } catch (err) {
      return '--';
    }
  }

}
