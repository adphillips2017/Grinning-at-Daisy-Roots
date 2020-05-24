import { Item } from './Items';
import { RustyDagger } from './Weapons';
import { MoldyBread } from './Consumables';

export class Player {
    private health: number;
    private inventory: Item[];
    private xpLevels: number[];
    x: number;
    y: number;
    strength: number;
    intelligence: number;
    perception: number;
    defense: number;
    luck: number;
    gold: number;
    level: number;
    xp: number;
    unallocatedPoints: number;
    isAlive: boolean;

    constructor() {
        this.health = 100;
        this.inventory = [
            new MoldyBread(),
            new Item('Lockpick', 3, 'Small metal tool used to open locks.  Break easily.'),
            new RustyDagger()
        ];
        this.strength = 4;
        this.intelligence = 4;
        this.perception = 4;
        this.luck = 2;
        this.gold = 0;
        this.x = 1;
        this.y = 2;
        this.xpLevels = [5, 7, 10, 15, 20];
        this.level = 0;
        this.xp = 0;
        this.unallocatedPoints = 0;
        this.isAlive = true;
    }

    getHealth(): number {
        return this.health;
    }

    modifyHealth(modifier: number): void {
        this.health = this.health + modifier;
        if (this.health < 0) {
            this.health = 0;
            this.isAlive = false;
        }
    }

    getDamage(): number {
        return this.strength;
    }

    takeDamage(damage: number): void {
        const damageModifier = this.calculateDamageModifier();
        this.modifyHealth(damage * damageModifier);
    }

    calculateDamageModifier(): number {
        const damageModifier = this.defense;

        return 1 - (damageModifier * .01);
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

    giveXP(xp: number): void {
        if (this.xpNeeded() >= xp) {
            this.xp += xp;
            return;
        }

        const leftOver = xp - this.xpNeeded();
        this.xp = leftOver;
    }

    xpNeeded(): number {
        return this.xpLevels[this.level + 1] - this.xp;
    }

    levelUp(): void {
        this.level += 1;
        this.unallocatedPoints += 1;
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

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    move(dx: number, dy: number): void{
        this.x += dx;
        this.y += dy;
    }

    moveNorth(): void {
        this.move(0, -1);
    }

    moveSouth(): void {
        this.move(0, 1);
    }

    moveEast(): void {
        this.move(1, 0);
    }

    moveWest(): void {
        this.move(-1, 0);
    }
}
