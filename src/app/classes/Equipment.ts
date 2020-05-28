import { Item } from './Items';
import { Effect } from '../models/Effect';

type EquipmentSlot = 'Head' | 'Chest' | 'Gloves' | 'Legs' | 'Feet' | 'Main-Hand' | 'Off-Hand';

class Equipment extends Item {
    slot: EquipmentSlot;
    effects: Effect[];

    constructor(label: string, description: string, slot: EquipmentSlot, effects: Effect[], count: number = 1) {
        super(label, count, description);

        this.slot = slot;
        this.effects = effects;
    }
}

class PlainMensBoots extends Equipment {
    constructor() {
        const label = 'Plain Men\'s Boots';
        let description = 'Plain black boots designed for men.  Not particularly stylish but they protect one\s feet well enough.';
        description += '[+2 Defense]';
        const slot = 'Feet';
        const effects = [{ stat: 'defense', modifier: 2 }];

        super(label, description, slot, effects);
    }
}

class RustyDagger extends Equipment {
    constructor(){
        const label = 'Rusty Dagger';
        const slot = 'Main-Hand';
        let description = 'A small, well-worn dagger. The crude metal has begun to oxidize.';
        description += '[+5 Attack]';
        const effects = [{ stat: 'attack', modifier: 5 }];
        super(label, description, slot, effects);
    }
}

class WoodCane extends Equipment {
    constructor(){
        const label = 'Wood Cane';
        const slot = 'Main-Hand';
        let description = 'A wooden tool used to aid walking.  The feel of it in your hand is familiar and oddly calming.';
        description += '[+4 Attack]';
        const effects = [{ stat: 'attack', modifier: 4 }];
        super(label, description, slot, effects);
    }
}

export {
    Equipment,
    PlainMensBoots,
    RustyDagger,
    WoodCane
};
