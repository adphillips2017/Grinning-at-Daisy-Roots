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
  unequipKeywords = ['unequip', 'un'];
  useKeywords = ['use', 'u'];
  inspectKeywords = ['inspect', 'examine', 'look'];
  fleeKeywords = ['flee'];
  northKeywords = ['up', 'north', 'forward', 'straight', 'n', 'forwards', 'f'];
  southKeywords = ['down', 'south', 'backward', 'backwards', 's', 'back', 'b'];
  eastKeywords = ['right', 'east', 'e', 'r'];
  westKeywords = ['left', 'west', 'w', 'l'];

  mapKey: MapKey = [
    ['--', 'ER', '--', 'E1', 'ER'],
    ['--', 'E1', 'ER', 'ER', 'E1'],
    ['ER', 'ER', 'E1', '--', 'ER'],
    ['--', 'ST', '--', 'XT', 'E1'],
    ['--', 'ER', '--', 'ER', 'E1']
  ];

  staminaCost: {
    combat: -2,
    flee: -5,
    search: -3
  };

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

    this.output('You also notice a small empty vial lying next to a tubing apparatus which you think might be useful as well.');
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
    else if (this.contains(keyword, this.inspectKeywords)) {
      this.inspect(command);
    }
    else if (this.contains(keyword, this.fleeKeywords)) {
      if (this.attemptToFlee(command)) { this.flee(command); }
    }
    else {
      this.output('Command not recognized, please try again.');
      this.output('Type "help" for a list of commands.');
    }
  }

  inspect(command: string[]): void {
    console.log('command: ', command);
    if (!command[1]) {
      this.output('You must inspect something, you cannot just inspect.');
      return;
    }

    if (command[1] === 'enemy') {
      if (this.currentTile().enemy){
        this.output(this.currentEnemy().description);
        return;
      }
      else {
        this.output('There is no enemy to inspect.');
        this.output('That you can see, anyway...');
        return;
      }
    }
    else if (command[1] === 'room') {
      this.output(this.currentTile().description);
      return;
    }

    let inspectChoice;

    if (command[2]){
      if (command[1] === 'equipment') {
        inspectChoice = parseInt(command[2], 10);
        if (isNaN(inspectChoice)) {this.output('Invalid inspect choice given.'); }
        else if (inspectChoice > this.player.getEquippedItems().length) { this.output('Equipment selection out of range.'); }
        else {
          this.output(this.player.getEquippedItems()[inspectChoice - 1].description);
          this.player.incrementActionCount();
        }
      } else {
        this.output('Unknown inspect command given.');
      }
      return;
    }

    inspectChoice = parseInt(command[1], 10);
    if (isNaN(inspectChoice)) {this.output('Invalid inspect choice given.'); }
    else if (inspectChoice > this.player.getInventory().length) { this.output('Item selection out of range.'); }
    else {
      this.output(this.player.getInventory()[inspectChoice - 1].description);
      this.player.incrementActionCount();
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

    const useChoice = parseInt(command[1], 10);
    if (isNaN(useChoice)) {
      this.output('Invalid use choice given.');
      return;
    }
    else if (useChoice > this.player.getInventory().length) {
      this.output('Item selection out of range.');
      return;
    }

    const useItem: any = this.player.getInventory()[useChoice - 1];
    this.output(this.player.useItem(useItem));
    if (useItem instanceof EmptyVial) { this.output(this.player.giveItem(new BloodVial())); }
    if (this.interaction.type === 'combat') { this.player.incrementActionCount(); }
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
    else if (equipChoice > this.player.getInventory().length) { this.output('Item selection out of range.'); }
    else {
      const equipItem: any = this.player.getInventory()[equipChoice - 1];
      this.output(this.player.equipItem(equipItem));
    }
    if (this.interaction.type === 'combat') { this.player.incrementActionCount(); }
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
    else if (unequipChoice > this.player.getEquippedItems().length) { this.output('Equipment selection out of range.'); }
    else {
      const equipItem: any = this.player.getEquippedItems()[unequipChoice - 1];
      this.output(this.player.unequipItem(equipItem));
    }
    if (this.interaction.type === 'combat') { this.player.incrementActionCount(); }
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
    if (this.contains(playerCommand[0], this.attackKeywords) && this.contains('attack', actions)){
      if (!this.player.hasEnoughStamina(this.staminaCost.combat)) {
        this.output('You don\'t have enough stamina for that!');
        return;
      }
      const playerDamage = this.player.getDamage();
      this.currentEnemy().takeDamage(playerDamage);
      this.player.incrementActionCount();
      this.player.modifyStamina(this.staminaCost.combat);
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
    }
    else if (this.contains(playerCommand[0], this.fleeKeywords) && this.contains('flee', actions)) {
      if (!this.player.hasEnoughStamina(this.staminaCost.flee)) {
        this.output('You don\'t have enough stamina for that!');
        return;
      }
      if (this.attemptToFlee(playerCommand)) {
        this.player.modifyStamina(this.staminaCost.flee);
        this.flee(playerCommand);
        return;
      }
    }
    else if (playerCommand[1]) {
      if (this.contains(playerCommand[0], this.inspectKeywords) && this.contains('inspect', actions)) {
        this.inspect(playerCommand);
      }
      else if (this.contains(playerCommand[0], this.useKeywords)) {
        this.useItem(playerCommand);
      }
      else if (this.contains(playerCommand[0], this.equipKeywords)) {
        this.equipItem(playerCommand);
      }
      else if (this.contains(playerCommand[0], this.unequipKeywords)) {
        this.unequipItem(playerCommand);
      }
      else {
        this.output('You cannot do that now. You are in combat.');
      }
    }
    else {
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

  flee(command: string[]): void {
    this.player.resetActionCount();
    this.interaction = { type: 'none', actions: [] };
    this.move(command, 'You manage to escape and run ');
  }

  attemptToFlee(command: string[]): boolean {
    if (this.interaction.type !== 'combat') {
      this.output('You have nothing to flee from. (That you can see.)');
      return false;
    }

    if (!command[1]) {
      this.output('Flee command requires a direction to run.');
      return false;
    }

    this.player.incrementActionCount();

    if (!this.playerCanMove(command[1])) {
      this.output('You turn and run but in your haste you forgot there is no exit in that direction.');
      return false;
    }

    const rollForFlee = Math.floor(Math.random() * Math.floor(100));
    const maxRoll = this.currentEnemy().fleeChance * this.player.getLuckModifier();
    console.log('rollforflee: ', rollForFlee, '\nenemyfleechance: ', this.currentEnemy().fleeChance);
    if (rollForFlee > maxRoll) {
      this.output('You weren\'t quick enough to escape.  The ' + this.currentEnemy().name + ' blocked your way.');
      return false;
    }

    return true;
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

  move(command: string[], movementMessage: string = 'You walk '){
    if (!command[1]){
      this.output('Move commands require a direction (north, south, east, or west).');
      this.output('No action taken.');
      return;
    }

    const direction = command[1];
    if (!this.playerCanMove(direction)) {
      this.output('You cannot move in that direction.');
      return;
    }

    if (this.contains(direction, this.northKeywords)){
      this.player.moveNorth();
      this.output(movementMessage + 'north.');
    }
    else if (this.contains(direction, this.southKeywords)){
      this.player.moveSouth();
      this.output(movementMessage + 'south.');
    }
    else if (this.contains(direction, this.eastKeywords)){
      this.player.moveEast();
      this.output(movementMessage + 'east.');
    }
    else if (this.contains(direction, this.westKeywords)){
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

    if (this.contains(direction, this.northKeywords)){
      if (this.tileAt(currentX, currentY - 1)){ canMove = true; }
    }
    else if (this.contains(direction, this.southKeywords)){
      if (this.tileAt(currentX, currentY + 1)){ canMove = true; }
    }
    else if (this.contains(direction, this.eastKeywords)){
      if (this.tileAt(currentX + 1, currentY)){ canMove = true; }
    }
    else if (this.contains(direction, this.westKeywords)){
      if (this.tileAt(currentX - 1, currentY)){ canMove = true; }
    }
    else{
      console.warn('Invalid direction given to playerCanMove().');
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
