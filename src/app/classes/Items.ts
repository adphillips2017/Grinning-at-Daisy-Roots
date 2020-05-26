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

class Teeth extends Item{
    constructor(count: number = 1){
        const label = 'Teeth';
        const description = 'Assorted human teeth or various sizes.  Some with the roots still attached. They look freshly pulled. Perhaps they are valuable?';
        super(label, count, description);
    }
}

export {
    Item,
    Teeth
};
