import { Component, OnInit, ViewChild } from '@angular/core';

import { Player } from 'src/app/classes/Player';
import { MapTile, ExitTile, EmptyRoomTile, StartTile, EnemyTier1 } from '../../classes/MapTiles';
import { Map } from '../../models/Map';
import { MapKey } from 'src/app/models/MapKey';
import { PlayerInteraction } from 'src/app/models/PlayerInteraction';
import { Enemy, getRandomInt } from 'src/app/classes/Enemy';
import { TerminalMessage } from 'src/app/models/TerminalMessage';
import { Loot } from 'src/app/models/Loot';
import { Item } from 'src/app/classes/Items';
import { MiniMapComponent } from 'src/app/modules/mini-map/mini-map.component';
import { PlainMensBoots } from 'src/app/classes/Equipment';
import { Consumable, EmptyVial, BloodVial } from 'src/app/classes/Consumables';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit {
  @ViewChild(MiniMapComponent) miniMap: MiniMapComponent;
  player: Player;
  messages: TerminalMessage[];
  interaction: PlayerInteraction;
  currentLevel: number;
  playerActions: number;
  worldMap: Map;

  helpKeywords = ['help'];
  moveKeywords = ['go', 'walk', 'travel', 'move', 'w', 'step', 'run', 'm'];
  inventoryKeywords = ['i', 'inventory'];
  attackKeywords = ['attack', 'hit', 'strike'];
  equipKeywords = ['equip', 'e'];
  unequipKeywords = ['unequip', 'u'];
  useKeywords = ['use'];

  mapKey: MapKey = [
    ['--', 'XT', '--'],
    ['--', 'E1', '--'],
    ['ER', 'ST', 'E1'],
    ['--', 'ER', '--']
  ];

  ngOnInit() {
    this.play();
  }

  play(): void {
    this.player = new Player();
    this.messages = [];
    this.interaction = { type: 'none', actions: []};
    this.currentLevel = 1;
    this.playerActions = 0;
    this.worldMap = [];

    this.output('You open your eyes and find yourself draped over a messy desk, the cherry wood cool against your perspiring face.');
    this.output('As you sit up your eyes adjust to the light and you begin to see the dimly lit interior of a room you don\'t recognize.');
    this.output('To your confusion and horror you realize you are completely naked save for your knickers, though you spot a pair of boots next to you which you promptly pick up.');
    this.output(this.player.giveItem(new PlainMensBoots()));

    //test
    this.output(this.player.giveItem(new EmptyVial()));

    this.createMap();
  }

  createMap(): void {
    const map = [];
    let mapRow = [];
    let startCoords: [number, number] = [-1, -1];
    let exitExists = false;

    this.mapKey.forEach((row, y) => {
      mapRow = [];
      row.forEach((tile, x) => {
        switch (tile){
          case('--'): {
            mapRow.push(undefined);
            break;
          }
          case('ST'): {
            mapRow.push(new StartTile(x, y));
            startCoords = [x, y];
            break;
          }
          case('E1'): {
            mapRow.push(new EnemyTier1(x, y));
            break;
          }
          case('ER'): {
            mapRow.push(new EmptyRoomTile(x, y));
            break;
          }
          case('XT'): {
            mapRow.push(new ExitTile(x, y));
            exitExists = true;
            break;
          }
          default: break;
        }
      });
      map.push(mapRow);
    });

    if (startCoords === [-1, -1]) { console.warn('No Start Tile.'); }
    if (!exitExists) { console.warn('No Exit Tile.'); }

    this.worldMap = map;
    this.player.moveTo(startCoords[0], startCoords[1]);

    console.log('map: ', map);
  }

  issueCommand(playerInput: string): void {
    this.output(playerInput, true);
    this.parseCommand(playerInput);
  }

  parseCommand(playerInput: string): void {
    const command = playerInput.split(' ');
    const keyword = command[0];

    if (this.interaction.type !== 'none') {
      this.handleInteraction(this.interaction, command);
      return;
    }

    if (this.contains(keyword, this.helpKeywords)) {
      this.help(command);
    }
    else if (this.contains(keyword, this.moveKeywords)) {
      this.move(command);
    }
    else if (this.contains(keyword, this.inventoryKeywords)) {
      this.printInventory();
    }
    else if (this.contains(keyword, this.equipKeywords)) {
      this.equipItem(command);
    }
    else if (this.contains(keyword, this.unequipKeywords)) {
      this.unequipItem(command);
    }
    else if (this.contains(keyword, this.useKeywords)) {
      this.useItem(command);
    }
    else {
      this.output('Command not recognized, please try again.');
      this.output('Type "help" for a list of commands.');
    }
  }

  useItem(command: string[]): void {
    if (!command[1]) {
      if (this.player.getConsumables().length < 1) {
        this.output('No usable items in inventory.');
        return;
      }

      this.output('Use action requires Item Number of the item you wish to use.  Usable items: ');
      let index = 1;
      this.player.getInventory().forEach(item => {
        if (item instanceof Consumable) {
          this.output(index + '. ' + item.label);
        }
        index++;
      });
      return;
    }

    const useChocie = parseInt(command[1], 10);
    if (isNaN(useChocie)) { this.output('Invalid use choice given.'); }
    if (useChocie > this.player.getInventory().length) { this.output('Item selection out of range.'); }

    const useItem: any = this.player.getInventory()[useChocie - 1];
    this.output(this.player.useItem(useItem));
    if (useItem instanceof EmptyVial) { this.output(this.player.giveItem(new BloodVial())); }
  }

  equipItem(command: string[]): void {
    if (!command[1]) {
      if (this.player.equipmentInInventory().length < 1) {
        this.output('No equipable items in inventory.  Perhaps I should be more observant as I explore.');
        return;
      }
      this.output('Equip action requires the Inventory Number of the item you wish to equip.  Equipable items:');
      let itemIndex = 1;
      this.player.equipmentInInventory().forEach(item => {
          this.output(itemIndex + '. ' + item.label);
          itemIndex++;
      });
      return;
    }

    const equipChoice = parseInt(command[1], 10);
    if (isNaN(equipChoice)) { this.output('Invalid equip choice given.'); }
    if (equipChoice > this.player.getInventory().length) { this.output('Item selection out of range.'); }

    const equipItem: any = this.player.getInventory()[equipChoice - 1];
    this.output(this.player.equipItem(equipItem));
  }

  unequipItem(command: string[]): void {
    if (!command[1]) {
      if (this.player.getEquippedItems().length < 1) {
        this.output('No items currently equipped.');
        return;
      }

      this.output('Unequip action requires the Equipment Number of the item you wish to equip.  Equipment:');
      let itemIndex = 1;
      this.player.getEquippedItems().forEach(item => {
          this.output(itemIndex + '. ' + item.label);
          itemIndex++;
      });
      return;
    }

    const unequipChoice = parseInt(command[1], 10);
    if (isNaN(unequipChoice)) { this.output('Invalid unequip choice given.'); }
    if (unequipChoice > this.player.getEquippedItems().length) { this.output('Equipment selection out of range.'); }

    const equipItem: any = this.player.getEquippedItems()[unequipChoice - 1];
    this.output(this.player.unequipItem(equipItem));
  }

  handleInteraction(interaction: PlayerInteraction, playerCommand: string[]): void {
    switch (interaction.type) {
      case('GameOver'): {
        this.handleGameOver(playerCommand);
        break;
      }
      case('combat'): {
        this.handleCombat(interaction.actions, playerCommand);
        break;
      }
      default: { break; }
    }
  }

  handleGameOver(playerCommand: string[]): void {
    if (playerCommand[0] === 'y') {
      this.play();
    }
  }

  gameOver() {
    this.output('Game Over.');
    this.output('Try again? (y/n)');
    this.interaction = { type: 'GameOver', actions: ['restart']};
  }

  handleCombat(actions: string[], playerCommand: string[]){
    const staminaCost = -2;
    if (this.contains(playerCommand[0], this.attackKeywords) && this.contains('attack', actions)){
      if (!this.player.hasEnoughStamina(staminaCost)) {
        this.output('You don\'t have enough stamina for that!');
        return;
      }
      const playerDamage = this.player.getDamage();
      this.currentEnemy().takeDamage(playerDamage);
      this.player.incrementActionCount();
      this.player.modifyStamina(staminaCost);
      this.output('You hit the ' + this.currentEnemy().name + ' for ' + playerDamage + ' damage.');

      if (!this.currentEnemy().isAlive) {
        this.output('You slayed the ' + this.currentEnemy().name + '.');
        this.output(this.currentEnemy().deadText);
        const lootRoll = this.rollForLoot(this.currentEnemy().loot);
        this.currentTile().imageState = 2;
        this.interaction = { type: 'none', actions: []};

        if (lootRoll) {
          const lootItem = this.getLoot(this.currentEnemy().loot, lootRoll);
          this.player.giveItem(lootItem);
          this.output('The ' + this.currentEnemy().name + ' dropped ' + lootItem.label + '.');
        }
      } else {
        this.output('The ' + this.currentEnemy().name + ' has ' + this.currentEnemy().getHealth() + ' health left.');
      }
    } else {
      this.output('You cannot do that now. You are in combat.');
    }

    if (this.player.getActionCount() >= this.currentEnemy().haste && this.currentEnemy().isAlive) {
      const enemyDamage = this.currentEnemy().getDamage();
      this.player.takeDamage(enemyDamage);
      this.player.resetActionCount();
      this.output('The ' + this.currentEnemy().name + ' hit you for ' + enemyDamage + ' damage.');

      if (!this.player.isAlive) {
        this.output('You were slain by the ' + this.currentEnemy().name + '.');
        this.gameOver();
      }
    }
  }

  rollForLoot(possibleLoot: Loot[]): number {
    let highChance = 0;

    possibleLoot.forEach(loot => {
      if (loot.chance > highChance) { highChance = loot.chance; }
    });

    const roll = getRandomInt(100);
    if (roll <= highChance) { return roll; }
    return 0;
  }

  getLoot(possibleLoot: Loot[], lootRoll: number): Item {
    let item: Item = { label: '', count: 0, description: '' };
    possibleLoot.forEach(loot => {
      if (lootRoll <= loot.chance) { item = loot.item; }
    });

    return item;
  }

  help(command: string[]) {
    const commandList = [
      'help         - print a list of commands.  User help "command" to get information about a specific command',
      'move         - aliases: go, walk, travel, move, w, step, run, m',
      'inventory    - aliases: i'
    ];

    if (!command[1]) {
      this.output('Here is the list of commands you have access to:');
      commandList.forEach(commandString => {
        this.output(commandString);
      });
      return;
    }

    const helpItem = command[1];

    if (this.contains(helpItem, this.moveKeywords)) {
      this.output('"move":  move your character in one of four directions.');
      this.output('Example:  move (north / up / forward...)');
      this.output('move aliases: ' + this.arrayToString(this.moveKeywords));
    }
    else if (this.contains(helpItem, this.inventoryKeywords)){
      this.output('"inventory": list the items currently in your inventory');
      this.output('inventory aliases: ' + this.arrayToString(this.inventoryKeywords));
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
    }
    else if (this.contains(direction, ['down', 'south', 'backward', 'backwards', 's', 'back', 'b'])){
      if (!this.playerCanMove('south')) { return; }
      this.player.moveSouth();
      this.output(movementMessage + 'south.');
    }
    else if (this.contains(direction, ['right', 'east', 'e', 'r'])){
      if (!this.playerCanMove('east')) { return; }
      this.player.moveEast();
      this.output(movementMessage + 'east.');
    }
    else if (this.contains(direction, ['left', 'west', 'w', 'l'])){
      if (!this.playerCanMove('west')) { return; }
      this.player.moveWest();
      this.output(movementMessage + 'west.');
    }
    else{
      this.output('Unrecognized move direction.');
      this.output('No action taken.');
      return;
    }

    this.miniMap.generateMiniMap();
    this.playIntro();
    if (this.currentTile().type === 'ExitTile') { this.gameOver(); }
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

    let displayIndex = 1;
    inventory.forEach(item => {
      this.output(displayIndex + '. ' + item.label + '  x' + item.count);
      displayIndex++;
    });
  }

  playIntro(): void {
    const currentTile = this.currentTile();
    this.output(currentTile.intro);
    this.interaction = currentTile.interaction;

    if (this.currentEnemy()) {
      if (this.currentEnemy().isAlive){ this.output(this.currentEnemy().aliveText); }
      else { this.output(this.currentEnemy().deadText); }
    }
  }

  getCurrentImage(): string {
    const image = '../../../assets/images/backgrounds/' + this.currentTile().images[this.currentTile().imageState];
    return image;
  }

  currentEnemy(): Enemy {
    return this.currentTile().enemy;
  }

  currentTile(): MapTile | undefined {
    const x = this.player.x;
    const y = this.player.y;
    return this.tileAt(x, y);
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

  arrayToString(array: string[]): string {
    let returnString = '';
    array.forEach((tempString, index) => {
      returnString += tempString;
      if (index < array.length - 1) { returnString += ', '; }
    });

    return returnString;
  }
}
