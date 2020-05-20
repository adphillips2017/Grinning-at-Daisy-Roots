export class Item {
    label: string;
    count: number;
    description: string;

    constructor(label: string, count: number, description: string){
        this.label = label;
        this.count = count;
        this.description = description;
    }
}
