const MapTileKeyArray = ['--', 'DT', 'ER', 'ST', 'XT', 'E1', 'E2', 'E3', 'LE'];
const RoomTypesArray = MapTileKeyArray.filter(key => key !== '--');

type TileKey = typeof MapTileKeyArray[number];
type MapKey = TileKey[][];

export {
    TileKey,
    MapKey,
    RoomTypesArray
};
