import { Enemy, getRandomTier1Enemy } from './Enemy';

class MapTile {
    x: number;
    y: number;
    intro: string;
    description: string;
    type: string;
    image: string;

    constructor(x: number, y: number, intro: string, description: string, type: string, image: string) {
        this.x = x;
        this.y = y;
        this.intro = intro;
        this.description = description;
        this.type = type;
        this.image = image;
    }
}

class StartTile extends MapTile {
    constructor(x: number, y: number){
        const intro = 'You open your eyes to see the dimly lit interior of a room you don\'t recognize.';
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

class EnemyTile extends MapTile {
    enemy: Enemy;

    constructor(x: number, y: number, intro: string, description: string, type: string, image: string, enemy: Enemy){
        super(x, y, intro, description, type, image);
        this.enemy = enemy;
    }
}

class EnemyTier1 extends EnemyTile {
    constructor(x: number, y: number){
        const enemy = getRandomTier1Enemy();
        const intro = enemy.aliveText;
        const description = enemy.description;
        const image = enemy.image;
        const type = 'EnemyTier1';

        super(x, y, intro, description, type, image, enemy);
    }
}

class ExitTile extends MapTile {
    constructor(x: number, y: number){
        let intro = 'You see a light brighter than any you\'ve seen since you awoke. '
        intro += 'That\'s not just any light.... it\'s the sun!  You\'ve found the exit!';
        const description = 'The light of the sun hurts your eyes as fresh air fills your lungs. ';
        const type = 'ExitTile';
        const image = 'exit-tile.jpg';
        super(x, y, intro, description, type, image);
    }
}

export {
    MapTile,
    StartTile,
    EmptyRoomTile,
    EnemyTier1,
    ExitTile
};
