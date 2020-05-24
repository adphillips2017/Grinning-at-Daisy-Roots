import { Loot } from '../models/Loot';
import { MoldyBread } from './Consumables';
import { PlayerInteraction } from '../models/PlayerInteraction';

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
    image: string;
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
        image: string,
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
        this.image = image;
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

class Rat extends Enemy {
    constructor() {
        const health = getRandomInt(5);
        const strength = 1;
        const defense = 0;
        const haste = 1;
        const xp = 1;
        const tier = 1;
        const loot = [{ chance: .5, item: new MoldyBread() }];
        const aliveText = 'A rat runs out from under the wall.  You smell like cheese.';
        const deadText = 'A dead rat lies before you.  What did he ever do to you?';
        const image = 'rat.jpg';
        const description = 'It\'s large, for a rat.  It moves fast and irraticaly.';
        const name = 'Rat';

        super(health, strength, defense, haste, xp, tier, loot, aliveText, deadText, image, description, name);
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
            return new Rat();
        }
    }
}

export {
    Enemy,
    Rat,
    getRandomTier1Enemy
};
