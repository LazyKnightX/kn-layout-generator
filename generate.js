const { ParseRoomLayout, ParseLevelLayout } = require('.')
const path = require('path')

let basepath = path.resolve('.')
let filepath, destpath

filepath = `${basepath}/tables/room.xlsx`
destpath = `${basepath}/dist/RoomLayout.j`
ParseRoomLayout(filepath, destpath, 16, 16, 3)

filepath = `${basepath}/tables/level.xlsx`
destpath = `${basepath}/dist/LevelLayout.j`
ParseLevelLayout(filepath, destpath, 7, 7, 5)
