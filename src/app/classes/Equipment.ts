import { Item } from './Items';
import { Effect } from '../models/Effect';

type EquipmentSlot = 'head' | 'chest' | 'hands' | 'legs' | 'feet' | 'main-hand' | 'off-hand';

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
        const description = 'Plain black boots designed for men.  Not particularly stylish but they protect one\s feet well enough.';
        const slot = 'feet';
        const effects = [{ stat: 'defense', modifier: 2 }];

        super(label, description, slot, effects);
    }
}

export {
    Equipment,
    PlainMensBoots
};
