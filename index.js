const xlsx = require('xlsx')
const fs = require('fs')
const path = require('path')

const TableDataCache = {}
function LoadTable(filename, sheetIndex = 0) {
    const cachekey = `${filename}|${sheetIndex}`
    if (TableDataCache.hasOwnProperty(cachekey) == false) {
        const wb = xlsx.readFile(filename)
        const sheet = wb.Sheets[wb.SheetNames[sheetIndex]]
        const rows = xlsx.utils.sheet_to_csv(sheet)
        TableDataCache[cachekey] = rows
    }
    return TableDataCache[cachekey]
}

function ParseRoomLayout(filepath, destpath, width = 16, height = 16, horizontal = 3) {

    /** @type {string} */
    let tb = LoadTable(filepath, 0)
    tb = tb.replace(/\r/gm, '')
    let _db = tb.split(/\n/gm)

    let rows = []
    let row = 0
    for (const line of _db) {
        rows[++row] = line.split(/,/gm)
    }

    const C_HORIZONTAL = horizontal
    const C_MAP_WIDTH = width
    const C_MAP_HEIGHT = height
    const C_BOX_WIDTH = C_MAP_WIDTH + 2
    const C_BOX_HEIGHT = C_MAP_HEIGHT + 2

    /**
    * 
    * @param {number} id 1~N
    */
    function pick_map(id) {
        const x = (id - 1) % C_HORIZONTAL
        const y = Math.floor((id - 1) / C_HORIZONTAL)

        const map = []

        const y1 = y * C_BOX_HEIGHT + 1
        const y2 = y1 + (C_MAP_HEIGHT + 1)
        const x1 = x * C_BOX_WIDTH + 1
        const x2 = x1 + (C_MAP_WIDTH + 1)

        for (let y = y1; y <= y2; y++) {
            /** @type {array} */
            const row = rows[y]
            if (row == null) { return null }
            map.push(row.slice(x1-1, x2))
        }
        
        return map
    }

    const output = []
    let x, y, i
    i = 0
    while (true) {
        i += 1
        if (i > 999) {
            console.error('ERROR: room overflow 999')
            throw 'ERROR: room overflow 999'
        }
        
        const datamap = pick_map(i)
        if (datamap === null) {
            console.log('ROOM COUNT: ' + (i-1))
            break
        }

        const id = parseInt(datamap[0][0])

        const info = {
            id: id,
            cells: []
        }

        for (let y = 1; y <= C_MAP_HEIGHT; y++) {
            for (let x = 1; x <= C_MAP_WIDTH; x++) {
                const cell = datamap[y][x]
                
                if (cell.constructor == String
                && cell != ""
                && cell != null
                && cell.length > 0
                ) {
                    info.cells.push({ x: x, y: y, value: cell })
                }
            }
        }

        output.push(info)
    }

    function generate_jass() {
        const jass = []
        for (const info of output) {
            const id = info.id
            jass.push(`if id == ${id} then`)
            for (const cell of info.cells) {
                jass.push(`    call setValue("${cell.value}", ${cell.x}, ${cell.y})`)
            }
            jass.push(`    return`)
            jass.push(`endif`)
        }
        if (fs.existsSync(path.dirname(destpath)) == false) {
            fs.mkdirSync(path.dirname(destpath))
        }
        fs.writeFile(destpath, jass.join('\r\n') + '\r\n', function() {
            console.log('done')
        })
    }

    generate_jass()
}

function ParseLevelLayout(filepath, destpath, width = 7, height = 7, horizontal = 5) {

    /** @type {string} */
    let tb = LoadTable(filepath, 0)
    tb = tb.replace(/\r/gm, '')
    let _db = tb.split(/\n/gm)

    let rows = []
    let row = 0
    for (const line of _db) {
        rows[++row] = line.split(/,/gm)
    }

    const C_HORIZONTAL = horizontal
    const C_MAP_WIDTH = width
    const C_MAP_HEIGHT = height
    const C_BOX_WIDTH = C_MAP_WIDTH + 2
    const C_BOX_HEIGHT = C_MAP_HEIGHT + 2

    /**
    * 
    * @param {number} id 1~N
    */
    function pick_map(id) {
        const x = (id - 1) % C_HORIZONTAL
        const y = Math.floor((id - 1) / C_HORIZONTAL)

        const map = []

        const y1 = y * C_BOX_HEIGHT + 1
        const y2 = y1 + (C_MAP_HEIGHT + 1)
        const x1 = x * C_BOX_WIDTH + 1
        const x2 = x1 + (C_MAP_WIDTH + 1)

        for (let y = y1; y <= y2; y++) {
            /** @type {array} */
            const row = rows[y]
            if (row == null) { return null }
            map.push(row.slice(x1-1, x2))
        }
        
        return map
    }

    const output = []
    let x, y, i
    i = 0
    while (true) {
        i += 1
        if (i > 999) {
            console.error('ERROR: level overflow 999')
            throw 'ERROR: level overflow 999'
        }
        
        const datamap = pick_map(i)
        if (datamap === null) {
            console.log('LEVEL COUNT: ' + (i-1))
            break
        }

        const id = parseInt(datamap[0][0])

        const info = {
            id: id,
            cells: []
        }

        for (let y = 1; y <= C_MAP_HEIGHT; y++) {
            for (let x = 1; x <= C_MAP_WIDTH; x++) {
                const cell = datamap[y][x]
                
                if (cell.constructor == String
                && cell != ""
                && cell != null
                && cell.length > 0
                ) {
                    info.cells[cell] = { x: x, y: y, value: cell }
                }
            }
        }

        output.push(info)
    }

    function generate_jass() {
        const jass = []
        const count = output.length
        jass.push(`random = GetRandomInt(1, ${count});`)

        for (const info of output) {
            const id = info.id
            jass.push(`if (random == ${id}) {`)
            for (const cell of info.cells) {
                if (cell.value > 0) {
                    jass.push(`    initRoomByPos(${cell.x}, ${cell.y});`)
                }
            }
            jass.push(`    return;`)
            jass.push(`}`)
        }
        if (fs.existsSync(path.dirname(destpath)) == false) {
            fs.mkdirSync(path.dirname(destpath))
        }
        fs.writeFile(destpath, jass.join('\r\n') + '\r\n', function() {
            console.log('done')
        })
    }

    generate_jass()
}

module.exports = { LoadTable, ParseRoomLayout, ParseLevelLayout }
