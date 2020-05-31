import { Component, OnInit, ViewChild } from '@angular/core';

import { Player } from 'src/app/classes/Player';
import { MapTile, ExitTile, EmptyRoomTile, StartTile, EnemyTier1, LootTile, LockedDoorTile, BlockedPath, EnemyTier2 } from '../../classes/MapTiles';
import { Map } from '../../models/Map';
import { MapKey, TileKey } from 'src/app/models/MapKey';
import { PlayerInteraction } from 'src/app/models/PlayerInteraction';
import { Enemy, getRandomInt } from 'src/app/classes/Enemy';
import { TerminalMessage } from 'src/app/models/TerminalMessage';
import { Loot } from 'src/app/models/Loot';
import { Item, OrnateKey, Note } from 'src/app/classes/Items';
import { MiniMapComponent } from 'src/app/modules/mini-map/mini-map.component';
import { Consumable, EmptyVial, BloodVial, StaleBread } from 'src/app/classes/Consumables';
import { Equipment, WoodCane } from 'src/app/classes/Equipment';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit {
  @ViewChild(MiniMapComponent) miniMap: MiniMapComponent;
  player: Player;
  messages: TerminalMessage[];
  manualInteraction: PlayerInteraction;
  currentLevel: number;
  playerActions: number;
  worldMap: Map;

  playState: 'character-creation' | 'game-canvas' | 'big-map';

  helpKeywords = ['help'];
  moveKeywords = ['go', 'walk', 'travel', 'move', 'w', 'step', 'run', 'm'];
  inventoryKeywords = ['i', 'inventory'];
  attackKeywords = ['attack', 'hit', 'strike'];
  equipKeywords = ['equip', 'e'];
  unequipKeywords = ['unequip', 'un', 'remove'];
  useKeywords = ['use', 'u'];
  inspectKeywords = ['inspect', 'examine', 'look'];
  fleeKeywords = ['flee'];
  northKeywords = ['up', 'north', 'forward', 'straight', 'n', 'forwards', 'f'];
  southKeywords = ['down', 'south', 'backward', 'backwards', 's', 'back', 'b', 'd'];
  eastKeywords = ['right', 'east', 'e', 'r'];
  westKeywords = ['left', 'west', 'w', 'l'];
  takeKeywords = ['take', 't', 'loot', 'grab', 'pick-up'];
  openKeywords = ['open', 'unlock', 'force'];
  mapKeywords = ['map'];
  searchKeywords = ['search', 'forage'];
  dropKeywords = ['drop', 'destroy'];

  noInteraction: PlayerInteraction = { type: 'none', actions: [] };

  mapKey1: MapKey = [
    ['--', 'E1', 'ER', 'ER', 'E1'],
    ['ER', 'ER', 'E1', '--', 'ER'],
    ['--', 'ST', '--', 'XT', 'E1'],
    ['--', 'DT', '--', 'ER', 'E1'],
    ['--', '--', '--', '--', '--']
  ];

  mapKey2: MapKey = [
    ['--', '--', '--', '--', '--', '--', 'ER', '--', '--', '--', '--', '--', '--', '--', '--'],
    ['--', '--', '--', 'E1', 'ER', '--', 'LE', 'ER', 'ER', 'E1', '--', '--', '--', '--', '--'],
    ['LK', 'E2', 'LC', 'E1', 'ER', 'ER', 'E1', '--', '--', 'ER', 'LE', '--', '--', 'ER', 'E1'],
    ['--', '--', '--', 'ER', '--', '--', 'ER', 'E1', '--', 'ER', 'E2', 'DE', '--', 'E2', 'LE'],
    ['--', '--', '--', 'ER', 'E1', 'N1', 'E1', 'ER', 'ER', 'E1', 'ER', '--', '--', 'E1', '--'],
    ['--', '--', '--', '--', '--', 'ER', '--', '--', '--', 'ER', '--', '--', '--', 'ER', 'ER'],
    ['--', '--', '--', '--', '--', 'ST', '--', '--', '--', 'LE', '--', '--', '--', 'E2', '--'],
    ['--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', 'XT', '--']
  ];

  currentMap: MapKey;

  staminaCost = {
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
    this.currentLevel = 1;
    this.playerActions = 0;
    this.worldMap = [];
    this.currentMap = this.mapKey2;
    this.manualInteraction = this.noInteraction;
    this.playState = 'character-creation';

    this.output('You open your eyes and find yourself draped over a messy desk, the cherry wood cool against your perspiring face.');
    this.output('As you sit up your eyes adjust to the light and you begin to see the dimly lit interior of a room you don\'t recognize.');
    this.output('To your confusion and horror you realize you are completely naked save for your knickers, though you spot a pair of boots lying next to you.');

    this.createMap();
    this.updateMapTileStatuses();
  }

  createMap(): void {
    const map = [];
    let mapRow = [];
    let startCoords: [number, number] = [-1, -1];
    let exitExists = false;
    let loot: Item[];

    this.currentMap.forEach((row, y) => {
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
          case('E2'): {
            mapRow.push(new EnemyTier2(x, y));
            break;
          }
          case('ER'): {
            mapRow.push(new EmptyRoomTile(x, y));
            break;
          }
          case('DN'): {
            mapRow.push(new LockedDoorTile(x, y, 'north'));
            break;
          }
          case('DS'): {
            mapRow.push(new LockedDoorTile(x, y, 'south'));
            break;
          }
          case('DE'): {
            mapRow.push(new LockedDoorTile(x, y, 'east'));
            break;
          }
          case('DW'): {
            mapRow.push(new LockedDoorTile(x, y, 'west'));
            break;
          }
          case('XT'): {
            mapRow.push(new ExitTile(x, y));
            exitExists = true;
            break;
          }
          case('N1'): {
            loot = [new EmptyVial(), new Note(1)];
            mapRow.push(new LootTile(x, y, loot));
            break;
          }
          case('LE'): {
            loot = [new EmptyVial()];
            mapRow.push(new LootTile(x, y, loot));
            break;
          }
          case('LK'): {
            loot = [new OrnateKey()];
            mapRow.push(new LootTile(x, y, loot));
            break;
          }
          case('LC'): {
            loot = [new WoodCane()];
            mapRow.push(new LootTile(x, y, loot));
            break;
          }
          default: {
            console.warn('Unknown maptile : ', tile);
          }
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
    if (playerInput === 'suicide') { this.play(); return; }
    this.output(playerInput, true);
    this.parseCommand(playerInput);
  }

  parseCommand(playerInput: string): void {
    const command = playerInput.split(' ');
    const keyword = command[0];

    if (this.currentInteraction().type !== 'none') {
      this.handleInteraction(this.currentInteraction(), command);
      return;
    }

    if (this.contains(keyword, this.helpKeywords)) {
      this.help();
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
    else if (this.contains(keyword, this.takeKeywords)) {
      this.takeItem(command);
    }
    else if (this.contains(keyword, this.openKeywords)) {
      this.open();
    }
    else if (this.contains(keyword, this.mapKeywords)) {
      this.playState = 'big-map';
    }
    else if (this.contains(keyword, this.searchKeywords)) {
      this.searchRoom();
    }
    else if (this.contains(keyword, this.dropKeywords)) {
      this.dropItem(command);
    }
    else {
      this.output('Command not recognized, please try again.');
      this.output('Check the commands list to the right for more information.');
    }
  }

  searchRoom(): void {
    if (this.currentTile().searched) {
      this.output('You begin to search the room, but then remember that you have already searched this room and give up in frustration.');
      return;
    }

    this.currentTile().searched = true;
    let foundItem = false;
    this.output('You begin scouring the room for anything that might be useful.');

    this.currentTile().searchResults.forEach(result => {
      if (this.player.perception >= result.requirement) {
        this.output('You happen to find a ' + result.reward.label + ' hidden in the room.');
        this.output(this.player.giveItem(result.reward));
        foundItem = true;
      }
    });

    if (!foundItem){ this.output('You don\'t find anything of use.'); }
  }

  open(){
    const tile = this.currentTile();
    if (!(tile instanceof LockedDoorTile)) {
      this.output('There is no door to open here..');
      return;
    }

    let index = -1;
    let success = false;
    let message = '';
    tile.blockedPaths.forEach(path => {
      if (success) { return; }
      path.solutions.forEach(solution => {
        if (success) { return; }
        if (solution.type === 'item') {
          index = this.player.findItemIndex(solution.item);
          if (index > -1) {
            message = solution.flavorText;
            success = true;
            this.unlockTile(path);
          }
        } else {
          if (this.player[solution.type] >= solution.stat && !success) {
            message = solution.flavorText;
            success = true;
            this.unlockTile(path);
          }
        }
      });
    });

    if (success) {
      this.output(message);
    }
    if (index > -1) {
      this.output(this.player.getInventory()[index].label + ' removed from inventory.');
      this.player.removeItem(this.player.getInventory()[index]);
    }
  }

  unlockTile(path: BlockedPath): void {
    const xy = this.getXYfromDirection(path.direction);
    const newX = this.player.x + xy[0];
    const newY = this.player.y + xy[1];
    this.worldMap[newY][newX] = this.getOpenedPathTile(path.mapTileKey, newX, newY);
    this.currentMap[newY][newX] = path.mapTileKey;
    this.miniMap.generateMiniMap();
  }

  getXYfromDirection(direction: string): [number, number] {
    switch (direction) {
      case('north'): {
        return [0, -1];
      }
      case('south'): {
        return [0, 1];
      }
      case('east'): {
        return [1, 0];
      }
      default: {
        return [-1, 0];
      }
    }
  }

  getOpenedPathTile(tileKey: TileKey, x: number, y: number): MapTile {
    switch (tileKey){
      case('--'): {
        return undefined;
      }
      case('ST'): {
        return new StartTile(x, y);
      }
      case('E1'): {
        return new EnemyTier1(x, y);
      }
      case('ER'): {
        return new EmptyRoomTile(x, y);
      }
      case('DN'): {
        return new LockedDoorTile(x, y, 'north');
      }
      case('DS'): {
        return new LockedDoorTile(x, y, 'south');
      }
      case('DE'): {
        return new LockedDoorTile(x, y, 'east');
      }
      case('DW'): {
        return new LockedDoorTile(x, y, 'west');
      }
      case('XT'): {
        return new ExitTile(x, y);
      }
      case('LE'): {
        const loot: Item[] = [new EmptyVial()];
        return new LootTile(x, y, loot);
      }
      default: return undefined;
    }
  }

  inspect(command: string[]): void {
    if (!command[1]) {
      this.output('You must inspect something, you cannot just inspect.');
      return;
    }

    if (command[1] === 'enemy') {
      if (this.currentTile().enemy && this.currentEnemy().isAlive){
        this.output(this.currentEnemy().description);
        return;
      } else if (this.currentTile().enemy && !this.currentEnemy().isAlive){
        this.output('It\'s dead.  The smell is so severe you begin to gag when trying to get near it..');
        return;
      }
      else {
        this.output('There is no enemy to inspect.');
        this.output('That you can see, anyway...');
        return;
      }
    }
    else if (command[1] === 'room') {
      this.output(this.currentTile().states[this.currentTile().currentState].description);
      if (this.currentTile().availableLoot.length > 0){
        this.output('You see ' + this.getAvailableLootString());
      }
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

  getAvailableLootString(): string {
    if (this.currentTile().availableLoot.length === 1){
      return '[1. ' + this.currentTile().availableLoot[0].label + '] lying on the ground.';
    } else if (this.currentTile().availableLoot.length > 1) {
      let lootExposition = '';
      this.currentTile().availableLoot.forEach((item, index) => {
        if (index === this.currentTile().availableLoot.length - 1) { lootExposition += 'and '; }
        lootExposition += '[' + index + '. ' + item.label + '] ';
      });
      lootExposition += ' lying around.';
      return lootExposition;
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
    if (this.currentInteraction().type === 'combat') { this.player.incrementActionCount(); }
  }

  takeItem(command: string[]): void {
    if (this.currentTile() instanceof LootTile) {
      if (this.currentTile().availableLoot.length > 0) {
        this.output('You walk slowly up to the wooden chest, unsure of what it might contain.');
        this.output('You stop before it.  Staring down at it you hesitate.  You have doubts as to the pleasantness of its contents.');
        this.output('You\'re curiousity gets the better of you and you slowly lift the lid of the chest to reveal its contents.');
        this.currentTile().currentState = 2;
        this.currentTile().availableLoot.forEach(item => {
          this.output(this.player.giveItem(item));
        });
        this.currentTile().availableLoot = [];
      } else if (this.currentTile().availableLoot.length <= 0) {
        this.output('You stare at the empty chest and contemplate how you could possibly loot it?');
        this.output('Maybe you could take the chest itself!');
        this.output('...');
        this.output('... no, you had better not.');
      }
      return;
    }
    else if (!command[1]) {
      this.output('You grab everything that looks like it might be useful.');
      this.currentTile().availableLoot.forEach(item => {
        this.output(this.player.giveItem(item));
      });
      if (this.currentTile().availableLoot.length < 1) { this.output('Which is apprently nothing.'); }
      this.currentTile().availableLoot = [];
      return;
    }

    const takeChoice = parseInt(command[1], 10);
    if (isNaN(takeChoice)) { this.output('Invalid take choice given.'); }
    else if (takeChoice > this.currentTile().availableLoot.length) { this.output('Take selection out of range.'); }
    else {
      const takeItem: any = this.currentTile().availableLoot[takeChoice - 1];
      this.output(this.player.giveItem(takeItem));
      this.currentTile().availableLoot.splice(this.currentTile().availableLoot.indexOf(takeItem), 1);
    }
  }

  dropItem(command: string[]): void {
    if (!command[1]) {
      if (this.player.getInventory().length > 1) {
        this.output('You didn\'t pass in an item number to drop, but you do have ' + this.player.getInventory());
      } else {
        this.output('You have nothing to drop.');
        return;
      }
    }

    const dropChoice = parseInt(command[1], 10);
    if (isNaN(dropChoice)) { this.output('Invalid drop choice given.'); }
    else if (dropChoice > this.player.getInventory().length) { this.output('Drop selection out of range.'); }
    else {
      const dropItem: Item = this.player.getInventory()[dropChoice - 1];
      this.output('You drop the ' + dropItem.label + '.');
      this.player.removeItem(dropItem);
      this.currentTile().availableLoot.push(dropItem);
    }
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
    if (this.currentInteraction().type === 'combat') { this.player.incrementActionCount(); }
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
    if (this.currentInteraction().type === 'combat') { this.player.incrementActionCount(); }
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
    this.manualInteraction = { type: 'GameOver', actions: ['restart']};
  }

  handleCombat(actions: string[], playerCommand: string[]){
    if (this.contains(playerCommand[0], this.attackKeywords)){
      if (!this.player.hasEnoughStamina(this.staminaCost.combat)) {
        this.output('You are exhausted and must take a moment to gather your strength.');
        this.output('Stamina +2');
        this.player.stamina += 2;
        this.player.incrementActionCount();
      }
      else {
        const playerDamage = this.player.getDamage();
        this.currentEnemy().takeDamage(playerDamage);
        this.player.incrementActionCount();
        this.player.modifyStamina(this.staminaCost.combat);
        this.output('You hit the ' + this.currentEnemy().name + ' for ' + playerDamage + ' damage.');

        if (!this.currentEnemy().isAlive) {
          this.output('You slayed the ' + this.currentEnemy().name + '.');
          const lootRoll = this.rollForLoot(this.currentEnemy().loot);
          this.currentTile().currentState = 2;

          if (lootRoll) {
            const lootItem = this.getLoot(this.currentEnemy().loot, lootRoll);
            this.currentTile().availableLoot.push(lootItem);
            this.output('The ' + this.currentEnemy().name + ' dropped ' + lootItem.label + ' onto the ground.');
          }
        } else {
          this.output('The ' + this.currentEnemy().name + ' has ' + this.currentEnemy().getHealth() + ' health left.');
        }
      }
    }
    else if (this.contains(playerCommand[0], this.fleeKeywords)) {
      if (!this.player.hasEnoughStamina(this.staminaCost.flee)) {
        this.output('You are exhausted and must take a moment to gather your strength.');
        this.output('Stamina +2');
        this.player.stamina += 2;
        this.player.incrementActionCount();
      }
      else if (this.attemptToFlee(playerCommand)) {
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
    this.move(command, 'You manage to escape and run ');
  }

  attemptToFlee(command: string[]): boolean {
    if (this.currentInteraction().type !== 'combat') {
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

  help() {
    const helpMessages = [
      'First and foremost, this game is still in development, so you might experience some wonkey interactions, bugs or just unbalanced combat.',
      'Please let me know of any issues you come across to be sure I\'m aware of them.',
      'If you\'re doing very little damage, try allocating more points to strength, equipping a weapon, or checking your stamina.  Lower stamina reduces you\'re damage output.',
      'If you\'re running out of stamina, food replenishes it.  Food is dropped by enemies sometimes, or you can "search" rooms to try and find more. Searching rooms success is based on your Perception skill.',
      'To get past doors, you need either a key or sometimes a specific stat requirement can bypass the key need.  Use the "open" command to try to open it.',
      'Pretty much everything should be able to be inspected, so try that if you want more information about something in the game world.'
    ];

    helpMessages.forEach(message => this.output(message));
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

    if (this.currentTile() instanceof StartTile) { this.currentTile().currentState = 2; }
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
    this.updateMapTileStatuses();
    if (this.currentTile() instanceof ExitTile) { this.gameOver(); }
  }

  playerCanMove(direction: string): boolean {
    if (this.contains(direction, this.northKeywords)){
      if (this.tileToThe('north')){ return true; }
    }
    else if (this.contains(direction, this.southKeywords)){
      if (this.tileToThe('south')){ return true; }
    }
    else if (this.contains(direction, this.eastKeywords)){
      if (this.tileToThe('east')){ return true; }
    }
    else if (this.contains(direction, this.westKeywords)){
      if (this.tileToThe('west')){ return true; }
    }
    else{
      console.warn('Invalid direction given to playerCanMove().');
    }

    return false;
  }

  updateMapTileStatuses(): void {
    this.currentTile().traveled = true;

    if (this.playerCanMove('north')){ this.tileToThe('north').found = true; }
    if (this.playerCanMove('south')){ this.tileToThe('south').found = true; }
    if (this.playerCanMove('east')){ this.tileToThe('east').found = true; }
    if (this.playerCanMove('west')){ this.tileToThe('west').found = true; }
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
    this.output(currentTile.states[currentTile.currentState].intro);
  }

  getCurrentImage(): string {
    const image = '../../../assets/images/backgrounds/' + this.currentTile().states[this.currentTile().currentState].image;
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

  tileToThe(direction: string): MapTile {
    const x = this.player.x;
    const y = this.player.y;

    switch (direction){
      case('north'): {
        return this.tileAt(x, y - 1);
      }
      case('south'): {
        return this.tileAt(x, y + 1);
      }
      case('east'): {
        return this.tileAt(x + 1, y);
      }
      case('west'): {
        return this.tileAt(x - 1, y);
      }
      default: {
        return undefined;
      }
    }
  }

  currentInteraction(): PlayerInteraction {
    if (this.manualInteraction.type !== 'none') { return this.manualInteraction; }
    return this.currentTile().states[this.currentTile().currentState].interaction;
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

  playerFinalized(player: Player): void {
    this.player = player;
    this.playState = 'game-canvas';
  }
}
