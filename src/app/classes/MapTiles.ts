import { Enemy, getRandomTier1Enemy } from './Enemy';
import { PlayerInteraction } from '../models/PlayerInteraction';
import { Item } from './Items';
import { PlainMensBoots } from './Equipment';

const noInteraction: PlayerInteraction = { type: 'none', actions: []};
const noEnemy = undefined;

interface SearchResult {
    stat: string;
    requirement: number;
    reward: Item;
}
interface TileState {
    image: string;
    description: string;
    intro: string;
    interaction: PlayerInteraction;
}
interface TileStates {
    [key: number]: TileState;
}

class MapTile {
    x: number;
    y: number;
    currentState: number;
    states: TileStates;
    enemy: Enemy;
    availableLoot: Item[];
    searchResults: SearchResult[];
    searched: boolean;
    traveled: boolean;
    found: boolean;

    constructor(
        x: number,
        y: number,
        states: TileStates,
        searchResults: SearchResult[],
        availableLoot: Item[],
        enemy: Enemy = noEnemy
    ) {
        this.x = x;
        this.y = y;
        this.states = states;
        this.enemy = enemy;
        this.availableLoot = availableLoot;
        this.searchResults = searchResults;
        this.currentState = 1;
        this.searched = false;
        this.traveled = false;
        this.found = false;
    }
}

class StartTile extends MapTile {
    constructor(x: number, y: number){
        let description = 'The room appears lived in.  By whom, you\'re not certain.  There are papers and books strewn about on the desk and surrounding floor.';
        description += ' Nothing looks familiar.';
        const states = {
            1: {
                image: 'starting-awaken.png',
                intro: '',
                description,
                interaction: noInteraction
            },
            2: {
                image: 'starting-room.png',
                intro: 'You step into a room that appears to be empty but you recognize it as the room you first awoke in.',
                description,
                interaction: noInteraction
            }
        };
        const availableLoot = [new PlainMensBoots()];
        super(x, y, states, [], availableLoot);
    }
}

class LootTile extends MapTile {
    constructor(x: number, y: number, availableLoot: Item[]){
        const description = 'This room is similar enough to the rest of the rooms you have had the displeasure of encountering.  The main difference being, of course, the wooden chest which yearns for your attention.';
        const descriptionOpened = 'This room is similar enough to the rest of the rooms you have had the displeasure of encountering.  The main difference being, of course, the wooden chest which you have already plundered.';
        const states: TileStates = {
            1: {
                image: 'chest-closed.png',
                intro: 'You step into the room and immidiately your eyes are drawn to the large wooden chest that sits squarely in the middle of the room.  Surely it holds something useful?',
                description,
                interaction: noInteraction
            },
            2: {
                image: 'chest-open.png',
                intro: 'You step into the room and immidiately your eyes are drawn to the large wooden chest that sits squarely in the middle of the room.  You remember it fondly.',
                description: descriptionOpened,
                interaction: noInteraction
            }
        };
        super(x, y, states, [], availableLoot);
    }
}



class EmptyRoomTile extends MapTile {
    constructor(x: number, y: number, searchResults: SearchResult[] ){
        const states: TileStates = {
            1: {
                image: 'empty-room-a.png',
                intro: 'You step into a room that appears to be devoid of life and unimportant.',
                description: 'Looking around you notice nothing out of the ordinary or of any use.',
                interaction: noInteraction
            }
        };
        super(x, y, states, searchResults, []);
    }
}

class EnemyTier1 extends MapTile {
    constructor(x: number, y: number){
        const enemy: Enemy = getRandomTier1Enemy();
        const states: TileStates = enemy.tileStates;

        super(x, y, states, [], [], enemy);
    }
}

class ExitTile extends MapTile {
    constructor(x: number, y: number){
        let intro = 'You see a light brighter than any you\'ve seen since you awoke. ';
        intro += 'That\'s not just any light.... it\'s the sun!  You\'ve found the exit!';
        const description = 'The light of the sun hurts your eyes as fresh air fills your lungs. ';
        const states: TileStates = {
            1: {
                image: 'door-closed.png',
                intro,
                description,
                interaction: { type: 'GameOver', actions: ['win']}
            }
        };
        super(x, y, states, [], []);
    }
}

export {
    TileStates,
    MapTile,
    StartTile,
    EmptyRoomTile,
    EnemyTier1,
    ExitTile,
    LootTile
};
