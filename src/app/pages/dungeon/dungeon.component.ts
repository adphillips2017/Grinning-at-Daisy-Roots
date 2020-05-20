import { Component, OnInit } from '@angular/core';

import { Player } from 'src/app/classes/Player';
import {Map } from '../../models/Map';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit {
  player: Player = new Player();
  map: Map;
  messages = [];
  currentLevel = 1;
  playerActions = 0;

  ngOnInit(){
    this.play();
  }

  play(): void {
    this.output('Welcome to the dungeon.');
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
      this.output(movementMessage + 'north.');
    }
    else if (this.contains(direction, ['down', 'south', 'backward', 'backwards', 's', 'back', 'b'])){
      this.output(movementMessage + 'south.');
    }
    else if (this.contains(direction, ['right', 'east', 'e', 'r'])){
      this.output(movementMessage + 'east.');
    }
    else if (this.contains(direction, ['left', 'west', 'w', 'l'])){
      this.output(movementMessage + 'west.');
    }
    else{
      this.output('Unrecognized move direction.');
      this.output('No action taken.');
    }
  }

  printInventory(): void {
    const inventory = this.player.getInventory();
    this.output('You currently have: ');

    inventory.forEach(item => {
      this.output('* ' + item.label + '  x' + item.count);
    });

    this.output('* Gold  x' + this.player.gold);
  }

  output(message: string, command = false): void {
    if (command){ this.messages.push({ type: 'player-input', message }); }
    else { this.messages.push({ type: 'output', message }); }
  }

  contains(keyword: string, list: string[]): boolean {
    return list.indexOf(keyword) >= 0;
  }
}
