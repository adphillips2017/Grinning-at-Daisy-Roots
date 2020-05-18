export class User {
    private health: number;
    private inventory: unknown[];
    strength: number;
    intelligence: number;
    perception: number;
    luck: number;

    constructor() {
        this.health = 100;
        this.inventory = [];
        this.strength = 4;
        this.intelligence = 4;
        this.perception = 4;
        this.luck = 2;
    }

    getHealth(): number {
        return this.health;
    }

    modifyHealth(modifier: number): void {
        this.health = this.health + modifier;
    }

    getInventory(): unknown[] {
        return this.inventory;
    }

    giveItem(item: unknown): void {
        this.inventory.push(item);
    }

    removeItem(item: unknown): void {
        if (this.inventory.indexOf(item) >= 0){ return; }
        this.inventory.splice(this.inventory.indexOf(item), 1);
    }
}
