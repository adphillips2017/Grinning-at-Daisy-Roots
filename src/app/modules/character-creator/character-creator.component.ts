import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Player } from 'src/app/classes/Player';

interface Stat {
  label: string;
  stat: string;
  increment: number;
  minimum: number;
}

@Component({
  selector: 'app-character-creator',
  templateUrl: './character-creator.component.html',
  styleUrls: ['./character-creator.component.scss']
})
export class CharacterCreatorComponent implements OnInit {
  @Input() player: Player;
  @Output() playerFinalized = new EventEmitter<Player>();

  placeHolderPlayer: Player = new Player();
  playerName = '';
  playerStats: Stat[] = [
    {
      label: 'Max Health',
      stat: 'maxHealth',
      increment: 10,
      minimum: 100,
    },
    {
      label: 'Max Stamina',
      stat: 'maxStamina',
      increment: 2,
      minimum: 25
    },
    {
      label: 'Defense',
      stat: 'defense',
      increment: 1,
      minimum: 0
    },
    {
      label: 'Strength',
      stat: 'strength',
      increment: 1,
      minimum: 0
    },
    {
      label: 'Intelligence',
      stat: 'intelligence',
      increment: 1,
      minimum: 0
    },
    {
      label: 'Perception',
      stat: 'perception',
      increment: 1,
      minimum: 0
    },
    {
      label: 'Luck',
      stat: 'luck',
      increment: 1,
      minimum: 0
    }
  ];

  ngOnInit() {
    this.placeHolderPlayer = Object.assign(this.placeHolderPlayer, this.player);
  }

  increaseStat(stat: Stat): void {
    if (!this.canIncrease()){ return; }
    this.placeHolderPlayer[stat.stat] += stat.increment;
    this.placeHolderPlayer.unallocatedPoints--;
  }

  decreaseStat(stat: Stat): void {
    if (!this.canDecrease(stat)){ return; }
    this.placeHolderPlayer[stat.stat] -= stat.increment;
    this.placeHolderPlayer.unallocatedPoints++;
  }

  canIncrease(): boolean {
    if (this.player.unallocatedPoints <= 0){ return false; }
    return true;
  }

  canDecrease(stat: Stat): boolean {
    if (this.placeHolderPlayer[stat.stat] <= this.player[stat.stat]){ return false; }

    return true;
  }

  finalizePlayer(): void {
    this.placeHolderPlayer.name = this.playerName;
    this.placeHolderPlayer.setHealth(this.placeHolderPlayer.maxHealth);
    this.placeHolderPlayer.setStamina(this.placeHolderPlayer.maxStamina);
    this.playerFinalized.emit(this.placeHolderPlayer);
  }
}
