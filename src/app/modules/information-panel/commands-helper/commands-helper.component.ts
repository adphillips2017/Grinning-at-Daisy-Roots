import { Component } from '@angular/core';

@Component({
  selector: 'app-commands-helper',
  templateUrl: './commands-helper.component.html',
  styleUrls: ['./commands-helper.component.scss']
})
export class CommandsHelperComponent {
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

  commands = [
    {
      label: 'move',
      aliases: this.moveKeywords,
      helpText: 'Use this keyword to move your character around the game world.  Must be paired with a [Direction].'
    },
    {
      label: 'inventory',
      aliases: this.inventoryKeywords,
      helpText: 'Use this keyword to check your inventory.'
    },
    {
      label: 'attack',
      aliases: this.attackKeywords,
      helpText: 'Use this keyword to attack the current enemy.  Your attack damage is determined by your strength stat and currently equipped items.'
    },
    {
      label: 'equip',
      aliases: this.equipKeywords,
      helpText: 'Use this keyword paired with an [Item Number] to equip that item from your inventory. You can only have one item in any given [Equipment Slot]. Any item already in that slot will automatically be unequipped.'
    },
    {
      label: 'unequip',
      aliases: this.unequipKeywords,
      helpText: 'Use this keyword with the [Equipment Number] of the item  you wish to unequip.  Unequipped items are moved back into your inventory.'
    },
    {
      label: 'use',
      aliases: this.useKeywords,
      helpText: 'Use this keyword along with the [Item Number] of a usable item in your inventory to trigger its effect.'
    },
    {
      label: 'inspect',
      aliases: this.inspectKeywords,
      helpText: 'Use this keyword to Inspect things your character can see such as an [Item Number], \'equipment [Equipment Number\',  \'room\', or (when in combat) \'enemy\'.'
    },
    {
      label: 'flee',
      aliases: this.fleeKeywords,
      helpText: 'Use this keyword with a [Direction] to attempt to flee from combat.  Your chance of fleeing is effected by your luck and the current enemy\'s stats.'
    },
    {
      label: 'north',
      aliases: this.northKeywords,
      helpText: 'This is a [Direction] that can be used with applicable commands, but not by itself.'
    },
    {
      label: 'south',
      aliases: this.southKeywords,
      helpText: 'This is a [Direction] that can be used with applicable commands, but not by itself.'
    },
    {
      label: 'east',
      aliases: this.eastKeywords,
      helpText: 'This is a [Direction] that can be used with applicable commands, but not by itself.'
    },
    {
      label: 'west',
      aliases: this.westKeywords,
      helpText: 'This is a [Direction] that can be used with applicable commands, but not by itself.'
    }
  ];
}
