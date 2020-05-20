export interface Path {
    type: 'path' | 'door' | 'wall';
    impassible: boolean;
    requirement: string[];
}
