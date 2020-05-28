import { Loot } from '../models/Loot';
import { StaleBread, EmptyVial } from './Consumables';
import { PlayerInteraction } from '../models/PlayerInteraction';
import { Teeth } from './Items';
import { TileStates } from './MapTiles';

const noInteraction: PlayerInteraction = { type: 'none', actions: [] };

class Enemy {
    private health: number;
    strength: number;
    defense: number;
    haste: number;
    xp: number;
    tier: number;
    isAlive: boolean;
    loot: Loot[];
    description: string;
    interaction: PlayerInteraction;
    name: string;
    fleeChance: number;
    tileStates: TileStates;

    constructor(
        health: number,
        strength: number,
        defense: number,
        haste: number,
        xp: number,
        tier: number,
        loot: Loot[],
        description: string,
        name: string,
        fleeChance: number,
        tileStates: TileStates
    ) {
        this.health = health;
        this.strength = strength;
        this.defense = defense;
        this.haste = haste;
        this.xp = xp;
        this.tier = tier;
        this.isAlive = true;
        this.loot = loot;
        this.description = description;
        this.name = name;
        this.fleeChance = fleeChance;
        this.tileStates = tileStates;
    }

    takeDamage(damage: number): void {
        if (damage < this.health) { this.health -= damage; }
        else {
            this.health = 0;
            this.isAlive = false;
        }

        this.health = Math.round((this.health + Number.EPSILON) * 100) / 100;
    }

    getHealth(): number {
        return this.health;
    }

    getDamage(): number {
        return this.strength;
    }
}

class Arachnid extends Enemy {
    constructor() {
        const health = getRandomInt(10) + 4;
        const strength = 1;
        const defense = 0;
        const haste = 1;
        const xp = 5;
        const tier = 1;
        const loot = [
            { chance: 5, item: new EmptyVial() },
            { chance: 15, item: new Teeth() },
            { chance: 60, item: new StaleBread() }
        ];
        const aliveText = 'A large arachnid looking creature appears to defend its nest.';
        const description = 'The arachnid is surprisingly quick for its size.';
        const name = 'Arachnid';
        const fleeChance = 50;
        const tileStates: TileStates = {
            1: {
                image: 'arachnid-alive.png',
                intro: 'You step into a room that appears to be the nesting grounds of some creature. ' + aliveText,
                description: 'The room is surprisingly intact considering the size and temperament of the creature before you.',
                interaction: { type: 'combat', actions: ['attack', 'flee', 'inspect']}
            },
            2: {
                image: 'arachnid-dead.png',
                intro: 'You step into the remnants of a battle you\ve already won.  The creature\'s lifeless carcass lies in the center of the room. You walk around it to the center of the room.',
                description: 'The room is in disarray in the wake of the battle that took place here.  The carcass is beginning to turn, the smell stings your nostrils.',
                interaction: noInteraction
            }
        };

        super(health, strength, defense, haste, xp, tier, loot, description, name, fleeChance, tileStates);
    }
}

function getRandomInt(max) {
    const randomNumber = Math.floor(Math.random() * Math.floor(max));
    if (randomNumber < 1) { return 1; }

    return randomNumber;
}

function getRandomTier1Enemy(): Enemy {
    const tier1Count = 1;
    const roll = getRandomInt(tier1Count);

    switch (roll){
        case(1): {
            return new Arachnid();
        }
    }
}

export {
    Enemy,
    Arachnid,
    getRandomTier1Enemy,
    getRandomInt
};
