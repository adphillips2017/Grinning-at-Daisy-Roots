import { Item } from '../models/Item';

export class User {
    private health: number;
    private inventory: Item[];
    strength: number;
    intelligence: number;
    perception: number;
    luck: number;
    gold: number;
    x: number;
    y: number;

    constructor() {
        this.health = 100;
        this.inventory = [
            { label: 'Crusty Bread', count: 1 },
            { label: 'Lockpick', count: 3 }
        ];
        this.strength = 4;
        this.intelligence = 4;
        this.perception = 4;
        this.luck = 2;
        this.gold = 0;
        this.x = 0;
        this.y = 0;
    }

    getHealth(): number {
        return this.health;
    }

    modifyHealth(modifier: number): void {
        this.health = this.health + modifier;
    }

    getInventory(): Item[] {
        return this.inventory;
    }

    giveItem(item: Item): void {
        this.inventory.push(item);
    }

    removeItem(item: Item): void {
        if (this.inventory.indexOf(item) >= 0){ return; }
        this.inventory.splice(this.inventory.indexOf(item), 1);
    }

    getStats(): unknown[] {
        return [
            { label: 'Health', value: this.getHealth()},
            { label: 'Strength', value: this.strength },
            { label: 'Intelligence', value: this.intelligence },
            { label: 'Perception', value: this.perception },
            { label: 'Luck', value: this.luck },
            { label: 'Inventory', value: this.getInventory().length },
            { label: 'Gold', value: this.gold },
        ];
    }
}
