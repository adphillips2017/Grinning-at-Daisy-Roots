import { Item } from './Items';
import { Equipment, PlainMensBoots } from './Equipment';
import { RustyDagger } from './Weapons';
import { StaleBread } from './Consumables';

export class Player {
    private health: number;
    private inventory: Item[];
    private xpLevels: number[];
    x: number;
    y: number;
    maxHealth: number;
    maxStamina: number;
    strength: number;
    stamina: number;
    intelligence: number;
    perception: number;
    defense: number;
    luck: number;
    gold: number;
    level: number;
    xp: number;
    unallocatedPoints: number;
    isAlive: boolean;
    private equipment: Equipment[];

    constructor() {
        this.maxHealth = 100;
        this.health = 100;
        this.equipment = [];
        this.inventory = [
            new PlainMensBoots(),
            new StaleBread()
        ];
        this.strength = 4;
        this.maxStamina = 25;
        this.stamina = 25;
        this.intelligence = 4;
        this.perception = 4;
        this.defense = 0;
        this.luck = 2;
        this.x = 1;
        this.y = 2;
        this.xpLevels = [5, 7, 10, 15, 20];
        this.level = 0;
        this.xp = 0;
        this.unallocatedPoints = 0;
        this.isAlive = true;
    }

    getEquippedItems(): Equipment[] {
        return this.equipment;
    }

    equipmentInInventory(): Equipment[] {
        const equipment: Equipment[] = [];

        this.getInventory().forEach(item => {
            if (item instanceof Equipment) { equipment.push(item); }
        });

        return equipment;
    }

    equipmentInSlot(slot: string): Equipment {
        return this.equipment.find(item => slot === item.slot);
    }

    equipItem(item: Equipment): string {
        if (!(item instanceof Equipment)) { return 'This item is not equipable.'; }

        let responseMessage = '';
        if (this.equipmentInSlot(item.slot)) {
            responseMessage += this.unequipItem(this.equipmentInSlot(item.slot));
        }
        this.removeItem(item);
        this.equipment.push(item);
        item.effects.forEach(effect => {
            switch (effect.stat) {
                case('max-health'): {
                    this.maxHealth += effect.modifier;
                    break;
                }
                case('strength'): {
                    this.strength += effect.modifier;
                    break;
                }
                case('max-stamina'): {
                    this.maxStamina += effect.modifier;
                    break;
                }
                case('intelligence'): {
                    this.intelligence += effect.modifier;
                    break;
                }
                case('perception'): {
                    this.perception += effect.modifier;
                    break;
                }
                case('defense'): {
                    this.defense += effect.modifier;
                    break;
                }
                case('luck'): {
                    this.luck += effect.modifier;
                    break;
                }
                default: {
                    console.warn('Item with unknown equipment stat: ', item);
                }
            }
        });

        return responseMessage += 'Equipped ' + item.label;
    }

    unequipItem(item: Equipment): string {
        if (this.equipment.indexOf(item) < 0) { return item.label + ' is not currently equipped.'; }
        this.inventory.unshift(item);
        this.equipment.splice(this.equipment.indexOf(item), 1);
        item.effects.forEach(effect => {
            switch (effect.stat) {
                case('max-health'): {
                    this.maxHealth -= effect.modifier;
                    break;
                }
                case('strength'): {
                    this.strength -= effect.modifier;
                    break;
                }
                case('max-stamina'): {
                    this.maxStamina -= effect.modifier;
                    break;
                }
                case('intelligence'): {
                    this.intelligence -= effect.modifier;
                    break;
                }
                case('perception'): {
                    this.perception -= effect.modifier;
                    break;
                }
                case('defense'): {
                    this.defense -= effect.modifier;
                    break;
                }
                case('luck'): {
                    this.luck -= effect.modifier;
                    break;
                }
                default: {
                    console.warn('Item with unknown equipment stat: ', item);
                }
            }
        });

        return 'Unequipped ' + item.label + '.';
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
        const damageAmount = damageModifier * damage * -1;
        this.modifyHealth(damageAmount);
    }

    calculateDamageModifier(): number {
        const damageModifier = this.defense;
        const damage = 1 - (damageModifier * .01);
        return damage;
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
        let itemIndex = -1;
        this.inventory.forEach((tempItem, index) => {
            if (tempItem.label === item.label) { itemIndex = index; }
        });

        if (itemIndex > -1){
            this.inventory[itemIndex].count += item.count;
            return;
        }

        if (item instanceof Equipment) {
            this.inventory.unshift(item);
        }else {
            this.inventory.push(item);
        }
    }

    removeItem(item: Item): void {
        if (this.inventory.indexOf(item) < 0){ return; }
        this.inventory.splice(this.inventory.indexOf(item), 1);
    }

    getStats(): unknown[] {
        return [
            { label: 'Health', value: this.getHealth()},
            { label: 'Stamina', value: this.stamina },
            { label: 'Defense', value: this.defense },
            { label: 'Strength', value: this.strength },
            { label: 'Intelligence', value: this.intelligence },
            { label: 'Perception', value: this.perception },
            { label: 'Luck', value: this.luck },
            { label: 'Inventory', value: this.getInventoryCount() }
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
