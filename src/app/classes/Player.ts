import { Item } from './Items';
import { RustyDagger } from './Weapons';

export class Player {
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
            new Item('Crusty Bread', 1, 'Gross moldy bread.'),
            new Item('Lockpick', 3, 'Small metal tool used to open locks.  Break easily.'),
            new RustyDagger()
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

    getInventoryCount(): number {
        let count = 0;

        this.inventory.forEach(item => {
            count += item.count;
        });

        return count;
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
            { label: 'Inventory', value: this.getInventoryCount() },
            { label: 'Gold', value: this.gold },
        ];
    }
}
