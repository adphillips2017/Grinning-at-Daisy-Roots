import { Item } from './Items';

interface Effect {
    stat: string;
    modifier: number;
}

class Consumable extends Item {
    effects: Effect[];
    useText: string;

    constructor(label: string, description: string, effects: Effect[], useText: string, count: number = 1){
      super(label, count, description);

      this.effects = effects;
      this.useText = useText;
    }
}

class StaleBread extends Consumable {
    constructor(){
        const label = 'Stale Bread';
        const description = 'Bread so old and hard it might be used as a weapon.';
        const effects = [{ stat: 'stamina', modifier: 5}];
        let useText = 'You attempt to bite into the bread with your front teeth but feel as though they might break. ';
        useText += 'You resort to skipping the incisors entirely and go straight to the molars. It crunches like rock candy but you get it down. ';
        useText += 'You feel slightly invigorated despite the horrid condition of the bread.';

        super(label, description, effects, useText);
    }
}

class EmptyVial extends Consumable {
    constructor(){
        const label = 'Empty Blood Vial';
        const description = 'An empty vial often used by physicians for bloodletting. It is accompanied most conveniently with a needle and surgical tube.';
        const effects = [{ stat: 'health', modifier: 5 }, {stat: 'stamina', modifier: -5 }];
        let useText = 'You attach the needle to the surgical tube, and it to the vial.  You stick the needle into your arm.';
        useText += ' As the vial begins to to turn crimson you feel a sense of relief fall over you, even if it did hurt initially.';

        super(label, description, effects, useText);
    }
}

class BloodVial extends Consumable {
    constructor(){
        const label = 'Blood Vial';
        let description = 'A vial of your own blood.  Deep red in color, it makes you feel safer for having it. ';
        description += 'Readministering the blood will heal some ailments.  It gets more potent over time.';
        const effects = [{ stat: 'health', modifier: 0 }, { stat: 'strength', modifier: 0 }];
        let useText = 'You reattach the surgical tube and needle to the bottle before inserting the needle into your arm.';
        useText += ' As you raise the bottle above your head you feel the warmth of the blood entering your arm. The rush is intoxicating.';

        super(label, description, effects, useText);
    }
}

export {
    Consumable,
    StaleBread,
    EmptyVial,
    BloodVial
};
