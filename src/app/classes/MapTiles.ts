import { Enemy, getRandomTier1Enemy } from './Enemy';
import { PlayerInteraction } from '../models/PlayerInteraction';

const noInteraction: PlayerInteraction = { type: 'none', actions: []};
const noEnemy = undefined;
interface Images {
    [key: number]: string;
}

class MapTile {
    x: number;
    y: number;
    intro: string;
    description: string;
    type: string;
    imageState: number;
    images: Images;
    interaction: PlayerInteraction;
    enemy: Enemy;

    constructor(
        x: number,
        y: number,
        intro: string,
        description: string,
        type: string,
        imageState: number,
        images: Images,
        enemy: Enemy = noEnemy,
        interaction: PlayerInteraction = noInteraction
    ) {
        this.x = x;
        this.y = y;
        this.intro = intro;
        this.description = description;
        this.type = type;
        this.imageState = imageState;
        this.images = images;
        this.interaction = interaction;
        this.enemy = enemy;
    }
}

class StartTile extends MapTile {
    constructor(x: number, y: number){
        const intro = 'You step into a room that appears to be empty but you recognize it as the room you first awoke in.';
        const description = 'The room appears to be empty.';
        const type = 'StartTile';
        const imageState = 1;
        const images = { 1: 'starting-awaken.png' };
        super(x, y, intro, description, type, imageState, images);
    }
}



class EmptyRoomTile extends MapTile {
    constructor(x: number, y: number){
        const intro = 'You step into a room that appears to be devoid of life and unimportant.';
        const description = 'Looking around you notice nothing out of the ordinary or of any use.';
        const type = 'EmptyRoomTile';
        const imageState = 1;
        const images = { 1: 'empty-room-a.png' };
        super(x, y, intro, description, type, imageState, images);
    }
}

class EnemyTier1 extends MapTile {
    constructor(x: number, y: number){
        const enemy = getRandomTier1Enemy();
        const intro = 'You step into a room that appears to be the nesting grounds of some small creature.';
        const description = enemy.description;
        const imageState = 1;
        const images = {
            1: enemy.imageAlive,
            2: enemy.imageDead
        };
        const interaction = enemy.interaction;
        const type = 'EnemyTier1';

        super(x, y, intro, description, type, imageState, images, enemy, interaction);
    }
}

class ExitTile extends MapTile {
    constructor(x: number, y: number){
        let intro = 'You see a light brighter than any you\'ve seen since you awoke. ';
        intro += 'That\'s not just any light.... it\'s the sun!  You\'ve found the exit!';
        const description = 'The light of the sun hurts your eyes as fresh air fills your lungs. ';
        const type = 'ExitTile';
        const imageState = 1;
        const images = { 1: 'door-closed.png' };
        const interaction = { type: 'GameOver', actions: ['win']};
        super(x, y, intro, description, type, imageState, images, noEnemy, interaction);
    }
}

export {
    MapTile,
    StartTile,
    EmptyRoomTile,
    EnemyTier1,
    ExitTile
};
