import { Loot } from '../models/Loot';
import { StaleBread } from './Consumables';
import { PlayerInteraction } from '../models/PlayerInteraction';
import { Teeth } from './Items';

class Enemy {
    private health: number;
    strength: number;
    defense: number;
    haste: number;
    xp: number;
    tier: number;
    isAlive: boolean;
    loot: Loot[];
    aliveText: string;
    deadText: string;
    imageAlive: string;
    imageDead: string;
    description: string;
    interaction: PlayerInteraction;
    name: string;

    constructor(
        health: number,
        strength: number,
        defense: number,
        haste: number,
        xp: number,
        tier: number,
        loot: Loot[],
        aliveText: string,
        deadText: string,
        imageAlive: string,
        imageDead: string,
        description: string,
        name: string
    ) {
        this.health = health;
        this.strength = strength;
        this.defense = defense;
        this.haste = haste;
        this.xp = xp;
        this.tier = tier;
        this.isAlive = true;
        this.loot = loot;
        this.aliveText = aliveText;
        this.deadText = deadText;
        this.imageAlive = imageAlive;
        this.imageDead = imageDead;
        this.description = description;
        this.interaction = { type: 'combat', actions: ['attack', 'flee']};
        this.name = name;
    }

    takeDamage(damage: number): void {
        if (damage < this.health) { this.health -= damage; }
        else {
            this.health = 0;
            this.isAlive = false;
        }
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
            { chance: 15, item: new Teeth() },
            { chance: 60, item: new StaleBread() }
        ];
        const aliveText = 'A large arachnid looking creature appears to defend its nest.';
        const deadText = 'The dead carcass of an arachnid lies in the center of the room.';
        const imageDead = 'arachnid-dead.png';
        const imageAlive = 'arachnid-alive.png';
        const description = 'The arachnid is surprisingly quick for its size.';
        const name = 'Arachnid';

        super(health, strength, defense, haste, xp, tier, loot, aliveText, deadText, imageAlive, imageDead, description, name);
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
