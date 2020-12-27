const { ParseLevelTable } = require('.')

const filepath = './table.xlsx'
const destpath = './data.j'
ParseLevelTable(filepath, destpath, 16, 16, 3)
