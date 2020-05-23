import { Item } from './Items';

class Consumable extends Item {
    health: number;

    constructor(label: string, count: number, description: string, health: number){
      super(label, count, description);

      this.health = health;
    }
}

class MoldyBread extends Consumable {
    constructor(){
        const label = 'Moldy Bread (+5hp)';
        const count = 1;
        const description = 'Bread so old and hard it might be used as a weapon.';
        const health = 5;

        super(label, count, description, health);
    }
}

export {
    Consumable,
    MoldyBread
};
