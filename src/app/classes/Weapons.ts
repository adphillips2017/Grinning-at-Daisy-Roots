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
        const damage = 3;
        const description = 'A small, well-worn dagger. The crude metal has begun to oxidize.';
        super(label, damage, description);
    }
}

export {
    Weapon,
    RustyDagger
};
