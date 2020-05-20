import { Path } from '../models/Path';

export class MapTile {
    type: string;
    paths: Path[];
    image: string;
    flavorText: string;
    thumbnail: string;
    discovered: boolean;
    enemy: unknown;
    npc: unknown;

    constructor(type: string, paths: Path[], image: string, flavorText: string, thumbnail: string, enemy: unknown, npc: unknown) {
        this.type = type;
        this.paths = paths;
        this.image = image;
        this.thumbnail = thumbnail;
        this.discovered = false;
        this.enemy = enemy;
        this.npc = npc;
    }


}