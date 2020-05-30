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
        const strength = 4;
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
                intro: 'You step into a room that appears to be the nesting grounds of something. ' + aliveText,
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

class Locust extends Enemy {
    constructor() {
        const health = getRandomInt(10) + 7;
        const strength = 5;
        const defense = 0;
        const haste = 1;
        const xp = 8;
        const tier = 1;
        const loot = [
            { chance: 15, item: new EmptyVial() },
            { chance: 30, item: new Teeth() },
            { chance: 70, item: new StaleBread() }
        ];
        const aliveText = 'A large flying creature appears to defend its nest.  Is that a locust? How did it get so big?';
        const description = 'The locust is the size of a small human, bigger than any insect you\'ve ever seen. The sound of its wings is terrible and unsettling.';
        const name = 'Locust';
        const fleeChance = 40;
        const tileStates: TileStates = {
            1: {
                image: 'insect-alive.png',
                intro: 'You step into a room that appears to be the nesting grounds of something. ' + aliveText,
                description: 'The room is surprisingly intact considering the size and temperament of the creature before you.',
                interaction: { type: 'combat', actions: ['attack', 'flee', 'inspect']}
            },
            2: {
                image: 'insect-dead.png',
                intro: 'You step into the remnants of a battle you\ve already won.  The creature\'s lifeless carcass lies in the center of the room. You walk around it to the center of the room.',
                description: 'The room is in disarray in the wake of the battle that took place here.  The carcass is beginning to turn, the smell stings your nostrils.',
                interaction: noInteraction
            }
        };

        super(health, strength, defense, haste, xp, tier, loot, description, name, fleeChance, tileStates);
    }
}

class Mutant extends Enemy {
    constructor() {
        const health = getRandomInt(10) + 25;
        const strength = 12;
        const defense = 2;
        const haste = 2;
        const xp = 15;
        const tier = 2;
        const loot = [
            { chance: 45, item: new EmptyVial(2) },
            { chance: 75, item: new Teeth(5) },
            { chance: 100, item: new StaleBread(2) }
        ];
        const aliveText = 'A large flying creature appears to defend its nest.  Is that a locust? How did it get so big?';
        const description = 'The locust is the size of a small human, bigger than any insect you\'ve ever seen. The sound of its wings is terrible and unsettling.';
        const name = 'Locust';
        const fleeChance = 40;
        const tileStates: TileStates = {
            1: {
                image: 'insect-alive.png',
                intro: 'You step into a room that appears to be the nesting grounds of something. ' + aliveText,
                description: 'The room is surprisingly intact considering the size and temperament of the creature before you.',
                interaction: { type: 'combat', actions: ['attack', 'flee', 'inspect']}
            },
            2: {
                image: 'insect-dead.png',
                intro: 'You step into the remnants of a battle you\ve already won.  The creature\'s lifeless carcass lies in the center of the room. You walk around it to the center of the room.',
                description: 'The room is in disarray in the wake of the battle that took place here.  The carcass is beginning to turn, the smell stings your nostrils.',
                interaction: noInteraction
            }
        };

        super(health, strength, defense, haste, xp, tier, loot, description, name, fleeChance, tileStates);
    }
}

class Demogorgon extends Enemy {
    constructor() {
        const health = getRandomInt(5) + 20;
        const strength = 7;
        const defense = 1;
        const haste = 1;
        const xp = 15;
        const tier = 2;
        const loot = [
            { chance: 45, item: new EmptyVial(2) },
            { chance: 75, item: new Teeth(5) },
            { chance: 100, item: new StaleBread(2) }
        ];
        const aliveText = 'A large large creature that appears not of this world appears before you.  You\'ve seen this monster before, you\'re sure of it.  Yes, in a book.  It\'s called a Demogorgon.';
        const description = 'The Demogorgon stands at least 7 feet tall.  It looks athletic and disgustingly grotesque. The entirety of its head is but a gaping toothed hole which it closes and opens menacingly. ';
        const name = 'Locust';
        const fleeChance = 40;
        const tileStates: TileStates = {
            1: {
                image: 'demogorgon-alive.png',
                intro: 'You step into a room and are greeted by an impossibly loud and high pitched screech.  It catches you off guard and you feel a jolt of addrenaline course through you.' + aliveText,
                description: 'The room is surprisingly intact considering the size and temperament of the creature before you.',
                interaction: { type: 'combat', actions: ['attack', 'flee', 'inspect']}
            },
            2: {
                image: 'demogorgon-dead.png',
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
    const tier1Count = 2;
    const roll = getRandomInt(tier1Count);

    switch (roll){
        case(1): {
            return new Arachnid();
        }
        case(2): {
            return new Locust();
        }
    }
}

function getRandomTier2Enemy(): Enemy {
    const tier1Count = 2;
    const roll = getRandomInt(tier1Count);

    switch (roll){
        case(1): {
            return new Mutant();
        }
        case(2): {
            return new Demogorgon();
        }
    }
}

export {
    Enemy,
    Arachnid,
    Locust,
    Mutant,
    Demogorgon,
    getRandomTier1Enemy,
    getRandomInt
};
