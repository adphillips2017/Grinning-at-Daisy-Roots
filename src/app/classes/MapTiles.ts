import { Enemy, getRandomTier1Enemy, getRandomInt, getRandomTier2Enemy } from './Enemy';
import { PlayerInteraction } from '../models/PlayerInteraction';
import { Item, OrnateKey, Teeth } from './Items';
import { PlainMensBoots } from './Equipment';
import { TileKey } from '../models/MapKey';
import { StaleBread, EmptyVial } from './Consumables';

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
interface Solution {
    type: string;
    item: Item;
    stat: number;
    flavorText: string;
}
interface BlockedPath {
    solutions: Solution[];
    direction: string;
    mapTileKey: TileKey;
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

class LockedDoorTile extends MapTile {
    blockedPaths: BlockedPath[];

    constructor(x: number, y: number, direction: string){
        let intro = 'You enter the room which, although looks similar at first to many others you\'ve seen before, is distincly different.';
        intro += ' One of the doors in this room has not been left agape like all the ones before, no, this door is shut.  Upon closer inspection, ';
        intro += 'the door is not only shut but also locked.  How peculiar.  The lock is fashioned from metal;  the design intricate and beautiful.';
        const description = 'You search the room up and down, but you cannot find any key lying about.  Perhaps one is hidden in another room?';
        let introTwo = 'You enter the room which, although looks similar at first to many others you\ve seen before, is distincly different.';
        introTwo += ' The door in this room is has not been left agape like all the ones before, no, this door is shut.  Upon closer inspection, ';
        introTwo += 'you notice that the door is infact unlocked.  Yes, now you recognize this room.  You\'ve been here before.  Are you going in circles?';
        let descriptionTwo = 'You search the room up and down, but you cannot find anything different about the room since the last time you were here. ';
        descriptionTwo += 'It does not appear to have been disturbed by anyone else since last you left.';
        const states = {
            1: {
                image: 'door-closed.png',
                intro,
                description,
                interaction: noInteraction
            },
            2: {
                image: 'door-closed.png',
                intro: introTwo,
                description: descriptionTwo,
                interaction: noInteraction
            }
        };
        super(x, y, states, [], []);
        const solutions: Solution[] = [
            { type: 'item', item: new OrnateKey(), stat: 0, flavorText: 'Oh wow. You stuck a pair of boots into a key hole. Why did that work!?'},
            { type: 'strength', item: undefined, stat: 5, flavorText: 'Oh WOW. You tried the handle to see if it was locked or just stuck, and you ripped the whole locking mechanism clean off!'}
        ];

        this.blockedPaths = [
            {
                solutions,
                direction,
                mapTileKey: 'ER'
            }
        ];
    }
}

class EmptyRoomTile extends MapTile {
    constructor(x: number, y: number){
        const searchResults: SearchResult[] = getSearchResults();
        const states: TileStates = {
            1: {
                image: 'empty-room-a.png',
                intro: 'You step into a room that appears to be devoid of life and unimportant.',
                description: 'Looking around you notice nothing out of the ordinary.',
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

class EnemyTier2 extends MapTile {
    constructor(x: number, y: number){
        const enemy: Enemy = getRandomTier2Enemy();
        const states: TileStates = enemy.tileStates;

        super(x, y, states, [], [], enemy);
    }
}

class ExitTile extends MapTile {
    constructor(x: number, y: number){
        let intro = 'You step into a room with a door. There\'s something different about the door that you can\'t quit place..';
        intro += 'An odd light is reflecting around the perimeter of the door, where it meets the wall.';
        intro += 'Wait... That\'s not just any light.... it\'s the sun!  You\'ve found the exit!';
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

function getSearchResults(): SearchResult[] {
    const results: SearchResult[] = [];
    const itemCountRoll = getRandomInt(10) > 6 ? 2 : 1;
    let itemRoll: number;
    let difficultyRoll: number;

    for (let i = 0; i < itemCountRoll; i++) {
        itemRoll  = getRandomInt(6);
        difficultyRoll = getRandomInt(8);

        if (itemRoll <= 3) {
            results.push({ stat: 'perception', requirement: difficultyRoll, reward: new StaleBread() });
        }
        else if (itemRoll <= 5) {
            results.push({ stat: 'perception', requirement: difficultyRoll, reward: new Teeth(2) });
        }
        else if (itemRoll <= 6) {
            results.push({ stat: 'perception', requirement: difficultyRoll, reward: new EmptyVial() });
        }
    }

    return results;
}

export {
    BlockedPath,
    TileStates,
    MapTile,
    StartTile,
    EmptyRoomTile,
    EnemyTier1,
    EnemyTier2,
    ExitTile,
    LootTile,
    LockedDoorTile
};
