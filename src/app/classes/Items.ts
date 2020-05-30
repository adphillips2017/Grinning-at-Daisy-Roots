class Item {
    label: string;
    count: number;
    description: string;

    constructor(label: string, count: number, description: string){
        this.label = label;
        this.count = count;
        this.description = description;
    }
}

class Teeth extends Item {
    constructor(count: number = 1){
        const label = 'Teeth';
        const description = 'Assorted human teeth or various sizes.  Some with the roots still attached. They look freshly pulled. Perhaps they are valuable?';
        super(label, count, description);
    }
}

class OrnateKey extends Item {
    constructor(){
        const label = 'Ornate Key';
        const description = 'The key has a heft to it that makes it pleasant to hold.  The metal cool in your hand.  The key appears old, its design surprisingly intricate.  You feel like you\'ve seen the pattern before.';
        super(label, 1, description);
    }
}

class Note extends Item {
    constructor(contents: number){
        const notes = [
            '',
            'To restore health, try bloodletting... Just use empty vials... It might drain your stamina a little but the resulting Blood vial is worth the risk...'
        ];
        const label = 'Strange Note';
        let description = 'It\'s an old scrap of paper with text scrawled across it, almost illegible.  The ink is smeared as though whoever left it was in a hurry. ';
        description += 'You can barely make out the contents, it reads "' + notes[contents] + '"';
        super(label, 1, description);
    }
}

export {
    Item,
    Teeth,
    OrnateKey,
    Note
};
