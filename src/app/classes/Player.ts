import { Item } from './Items';
import { Equipment } from './Equipment';
import { BloodVial, Consumable } from './Consumables';
import { Effect } from '../models/Effect';

export class Player {
    name: string;
    private health: number;
    private inventory: Item[];
    private xpLevels: number[];
    private equipment: Equipment[];
    private actionCount: number;
    x: number;
    y: number;
    maxHealth: number;
    maxStamina: number;
    attack: number;
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
    temporaryEffects: Effect[];

    constructor() {
        this.name = 'You';
        this.maxHealth = 100;
        this.health = 100;
        this.attack = 1;
        this.equipment = [];
        this.inventory = [];
        this.strength = 0;
        this.maxStamina = 25;
        this.stamina = 25;
        this.intelligence = 0;
        this.perception = 0;
        this.defense = 0;
        this.luck = 0;
        this.x = 1;
        this.y = 2;
        this.xpLevels = [5, 7, 10, 15, 20];
        this.level = 0;
        this.xp = 0;
        this.unallocatedPoints = 15;
        this.isAlive = true;
        this.actionCount = 0;
        this.temporaryEffects = [];
    }

    getLuckModifier(): number {
        return (this.luck * .02) + 1;
    }

    getActionCount(): number {
        return this.actionCount;
    }

    incrementActionCount(): void {
        this.actionCount++;
        this.ageBloodVials();
        this.resolveTemporaryEffects();
    }

    resetActionCount(): void {
        this.actionCount = 0;
    }

    resolveTemporaryEffects(): void {
        this.temporaryEffects.forEach(effect => {
            effect.duration--;
            if (effect.duration <= 0) {
                this.temporaryEffects.splice(this.temporaryEffects.indexOf(effect));
                this.removeEffect(effect);
            }
        });
    }

    ageBloodVials(): void {
        this.inventory.forEach(item => {
            if (item instanceof BloodVial) {
                this.removeItem(item);
                console.log('action count: ', item.age);
                this.giveItem(new BloodVial(item.age + 1));
            }
        });
    }

    getConsumables(): Consumable[] {
        const consumables: Consumable[] = [];

        this.getInventory().forEach(item => {
            if (item instanceof Consumable) { consumables.push(item); }
        });

        return consumables;
    }

    useItem(item: Consumable): string {
        if (!(item instanceof Consumable)) { return 'This item is not usable.'; }

        item.effects.forEach(effect => {
            if (effect.duration) {
                this.temporaryEffects.push(effect);
            }

            this.addEffect(effect);
        });

        this.removeItem(item);
        return item.useText;
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
        item.effects.forEach(effect => { this.addEffect(effect); });

        return responseMessage += 'Equipped ' + item.label;
    }

    unequipItem(item: Equipment): string {
        if (this.equipment.indexOf(item) < 0) { return item.label + ' is not currently equipped.'; }
        this.inventory.unshift(item);
        this.equipment.splice(this.equipment.indexOf(item), 1);
        item.effects.forEach(effect => { this.removeEffect(effect); });

        return 'Unequipped ' + item.label + '.';
    }

    addEffect(effect: Effect): void {
        switch (effect.stat) {
            case('health'): {
                this.modifyHealth(effect.modifier);
                break;
            }
            case('max-health'): {
                this.maxHealth += effect.modifier;
                break;
            }
            case('strength'): {
                this.strength += effect.modifier;
                break;
            }
            case('stamina'): {
                this.modifyStamina(effect.modifier);
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
                console.warn('Effect with unknown equipment stat: ', effect);
            }
        }
    }

    removeEffect(effect: Effect): void {
        switch (effect.stat) {
            case('health'): {
                this.modifyHealth(-1 * effect.modifier);
                break;
            }
            case('max-health'): {
                this.maxHealth -= effect.modifier;
                break;
            }
            case('strength'): {
                this.strength -= effect.modifier;
                break;
            }
            case('stamina'): {
                this.modifyStamina(-1 * effect.modifier);
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
                console.warn('Effect with unknown equipment stat: ', effect);
            }
        }
    }

    getHealth(): number {
        return this.health;
    }

    modifyHealth(modifier: number): void {
        console.log('modifier: ', modifier);
        this.health = this.health + modifier;
        if (this.health < 0) {
            this.health = 0;
            this.isAlive = false;
        } else if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        this.health = Math.round((this.health + Number.EPSILON) * 100) / 100;
    }

    setHealth(health: number): void {
        this.health = health;
    }

    setStamina(stamina: number): void {
        this.stamina = stamina;
    }

    modifyStamina(modifier: number): void {
        this.stamina = this.stamina + modifier;
        if (this.stamina > this.maxStamina) {
            this.stamina = this.maxStamina;
        }
    }

    hasEnoughStamina(staminaRequired: number): boolean {
        return this.stamina + staminaRequired >= 0;
    }

    getDamage(): number {
        const rawDamage = this.attack;
        const strengthModifier = this.strength * .75;
        let staminaPenalty = 1 - (0.05 * (this.maxStamina - this.stamina));
        if (staminaPenalty < 0.8){ staminaPenalty = 0.8; }
        const damage = rawDamage + strengthModifier * staminaPenalty;

        return  Math.round((damage + Number.EPSILON) * 100) / 100;
    }

    takeDamage(damage: number): void {
        const defenseModifier = this.calculateDefenseModifier();
        const damageAmount = defenseModifier * damage * -1;
        this.modifyHealth(damageAmount);
    }

    calculateDefenseModifier(): number {
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

    giveItem(item: Item): string {
        let itemIndex = -1;
        this.inventory.forEach((tempItem, index) => {
            if (tempItem.label === item.label) { itemIndex = index; }
        });

        if (itemIndex > -1){
            this.inventory[itemIndex].count += item.count;
            return item.count + ' ' + item.label + ' added to your inventory.';
        }

        if (item instanceof Equipment) {
            this.inventory.unshift(item);
        }else {
            this.inventory.push(item);
        }

        return item.count + ' ' + item.label + ' added to your inventory.';
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
            { label: 'Luck', value: this.luck }
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
