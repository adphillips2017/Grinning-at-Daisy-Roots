import { Component, OnInit } from '@angular/core';

import { Player } from 'src/app/classes/Player';
import { MapTile, ExitTile, EmptyRoomTile, StartTile } from '../../classes/MapTiles';
import { Map } from '../../models/Map';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit {
  player: Player = new Player();
  messages = [];
  currentLevel = 1;
  playerActions = 0;
  worldMap: Map = [];

  ngOnInit(){
    this.play();
  }

  play(): void {
    this.output('Welcome to the dungeon.');
    this.createMap();
    this.output(this.tileAt(this.player.x, this.player.y).intro);
  }

  createMap(): void {
    let row = [];
    row.push(undefined);
    row.push(new ExitTile(1, 0));
    row.push(undefined);
    this.worldMap.push(row);

    row = [];
    row.push(undefined);
    row.push(new EmptyRoomTile(1, 1));
    row.push(undefined);
    this.worldMap.push(row);

    row = [];
    row.push(new EmptyRoomTile(0, 2));
    row.push(new StartTile(1, 2));
    row.push(new EmptyRoomTile(2, 2));
    this.worldMap.push(row);

    row = [];
    row.push(undefined);
    row.push(new EmptyRoomTile(1, 3));
    row.push(undefined);
    this.worldMap.push(row);
  }

  issueCommand(playerInput: string): void {
    this.output(playerInput, true);
    this.parseCommand(playerInput);
  }

  parseCommand(playerInput: string): void {
    const command = playerInput.split(' ');
    const keyword = command[0];

    if (this.contains(keyword, ['go', 'walk', 'travel', 'move', 'w', 'step', 'run', 'm'])) {
      this.move(command);
    }
    else if (this.contains(keyword, ['i', 'inventory'])){
      this.printInventory();
    }
    else {
      this.output('Command not recognized, please try again.');
      this.output('Type "help" for a list of commands.');
    }
  }

  move(command: string[]){
    if (!command[1]){
      this.output('Move commands require a direction (north, south, east, or west).');
      this.output('No action taken.');
      return;
    }

    const movementMessage = 'You walk ';
    const direction = command[1];

    if (this.contains(direction, ['up', 'north', 'forward', 'straight', 'n', 'forwards', 'f'])){
      if (!this.playerCanMove('north')) { return; }
      this.player.moveNorth();
      this.output(movementMessage + 'north.');
      this.playIntro();
    }
    else if (this.contains(direction, ['down', 'south', 'backward', 'backwards', 's', 'back', 'b'])){
      if (!this.playerCanMove('south')) { return; }
      this.player.moveSouth();
      this.output(movementMessage + 'south.');
      this.playIntro();
    }
    else if (this.contains(direction, ['right', 'east', 'e', 'r'])){
      if (!this.playerCanMove('east')) { return; }
      this.player.moveEast();
      this.output(movementMessage + 'east.');
      this.playIntro();
    }
    else if (this.contains(direction, ['left', 'west', 'w', 'l'])){
      if (!this.playerCanMove('west')) { return; }
      this.player.moveWest();
      this.output(movementMessage + 'west.');
      this.playIntro();
    }
    else{
      this.output('Unrecognized move direction.');
      this.output('No action taken.');
    }
  }

  playerCanMove(direction: string): boolean {
    let canMove = false;
    const currentX = this.player.x;
    const currentY = this.player.y;

    switch (direction){
      case('north'): {
        if (this.tileAt(currentX, currentY - 1)){ canMove = true; }
        break;
      }
      case('south'): {
        if (this.tileAt(currentX, currentY + 1)){ canMove = true; }
        break;
      }
      case('east'): {
        if (this.tileAt(currentX + 1, currentY)){ canMove = true; }
        break;
      }
      case('west'): {
        if (this.tileAt(currentX - 1, currentY)){ canMove = true; }
        break;
      }
      default: console.warn('Invalid direction given to playerCanMove().');
    }

    if (!canMove){ this.output('That way appears to be blocked.'); }
    return canMove;
  }

  printInventory(): void {
    const inventory = this.player.getInventory();
    this.output('You currently have: ');

    inventory.forEach(item => {
      this.output('* ' + item.label + '  x' + item.count);
    });

    this.output('* Gold  x' + this.player.gold);
  }

  playIntro(): void {
    const currentTile = this.tileAt(this.player.x, this.player.y);
    this.output(currentTile.intro);
  }

  tileAt(x: number, y: number): MapTile | undefined{
    if (x < 0 || y < 0){ return undefined; }

    try {
      return this.worldMap[y][x];
    } catch (err) {
      return undefined;
    }
  }

  output(message: string, command = false): void {
    if (command){ this.messages.push({ type: 'player-input', message }); }
    else { this.messages.push({ type: 'output', message }); }
  }

  contains(keyword: string, list: string[]): boolean {
    return list.indexOf(keyword) >= 0;
  }
}
