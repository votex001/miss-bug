import fs from "fs"



export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}


export  function readJsonFile(path){
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}
