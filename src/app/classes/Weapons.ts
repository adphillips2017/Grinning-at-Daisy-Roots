import { Item } from './Items';

class Weapon extends Item {
    damage: number;

    constructor(label: string, damage: number, description: string){
        super(label, 1, description);
        this.damage = damage;
    }
}

class RustyDagger extends Weapon {
    constructor(){
        const label = 'Rusty Dagger';
        const damage = 5;
        const description = 'A small, well-worn dagger. The crude metal has begun to oxidize.';
        super(label, damage, description);
    }
}

class WoodCane extends Weapon {
    constructor(){
        const label = 'Wood Cane';
        const damage = 4;
        const description = 'A wooden tool used to aid walking.  The feel of it in your hand is familiar and oddly calming.';
        super(label, damage, description);
    }
}

export {
    Weapon,
    RustyDagger,
    WoodCane
};
