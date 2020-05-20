class MapTile {
    x: number;
    y: number;
    intro: string;
    description: string;

    constructor(x: number, y: number, intro: string, description: string) {
        this.x = x;
        this.y = y;
        this.intro = intro;
        this.description = description;
    }
}

class StartTile extends MapTile {
    constructor(x: number, y: number){
        const intro = 'You open your eyes to see the dimly lit interior of a room you don\'t recognize.';
        const description = 'The room appears to be empty.';
        super(x, y, intro, description);
    }
}

class EmptyRoomTile extends MapTile {
    constructor(x: number, y: number){
        const intro = 'You step into a room that appears to be empty and unimportant.';
        const description = 'Looking around you notice nothing of import.';
        super(x, y, intro, description);
    }
}

class ExitTile extends MapTile {
    constructor(x: number, y: number){
        let intro = 'You see a light brighter than any you\'ve seen since you awoke. '
        intro += 'That\'s not just any light.... it\'s the sun!  You\'ve found the exit!';
        const description = 'The light of the sun hurts your eyes as fresh air fills your lungs. ';
        super(x, y, intro, description);
    }
}

export {
    MapTile,
    StartTile,
    EmptyRoomTile,
    ExitTile
};
