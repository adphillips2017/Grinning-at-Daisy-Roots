import { Enemy, getRandomTier1Enemy } from './Enemy';
import { PlayerInteraction } from '../models/PlayerInteraction';

const noInteraction: PlayerInteraction = { type: 'none', actions: []};
const noEnemy = undefined;

class MapTile {
    x: number;
    y: number;
    intro: string;
    description: string;
    type: string;
    image: string;
    interaction: PlayerInteraction;
    enemy: Enemy;

    constructor(
        x: number,
        y: number,
        intro: string,
        description: string,
        type: string,
        image: string,
        enemy: Enemy = noEnemy,
        interaction: PlayerInteraction = noInteraction
    ) {
        this.x = x;
        this.y = y;
        this.intro = intro;
        this.description = description;
        this.type = type;
        this.image = image;
        this.interaction = interaction;
        this.enemy = enemy;
    }
}

class StartTile extends MapTile {
    constructor(x: number, y: number){
        const intro = 'You step into a room that appears to be empty but you recognize it as the room you first awoke in.';
        const description = 'The room appears to be empty.';
        const type = 'StartTile';
        const image = 'starting-tile.jpg';
        super(x, y, intro, description, type, image);
    }
}

class EmptyRoomTile extends MapTile {
    constructor(x: number, y: number){
        const intro = 'You step into a room that appears to be empty and unimportant.';
        const description = 'Looking around you notice nothing of import.';
        const type = 'EmptyRoomTile';
        const image = 'empty-room.jpg';
        super(x, y, intro, description, type, image);
    }
}

class EnemyTier1 extends MapTile {
    constructor(x: number, y: number){
        const enemy = getRandomTier1Enemy();
        const intro = 'You step into a room that appears to be the nesting grounds of some small creatures.';
        const description = enemy.description;
        const image = enemy.image;
        const interaction = enemy.interaction;
        const type = 'EnemyTier1';

        super(x, y, intro, description, type, image, enemy, interaction);
    }
}

class ExitTile extends MapTile {
    constructor(x: number, y: number){
        let intro = 'You see a light brighter than any you\'ve seen since you awoke. ';
        intro += 'That\'s not just any light.... it\'s the sun!  You\'ve found the exit!';
        const description = 'The light of the sun hurts your eyes as fresh air fills your lungs. ';
        const type = 'ExitTile';
        const image = 'exit-tile.jpg';
        const interaction = { type: 'GameOver', actions: ['win']};
        super(x, y, intro, description, type, image, noEnemy, interaction);
    }
}

export {
    MapTile,
    StartTile,
    EmptyRoomTile,
    EnemyTier1,
    ExitTile
};
