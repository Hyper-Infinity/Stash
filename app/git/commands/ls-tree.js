const path = require("path")
const fs = require('fs')
const zlib = require('zlib')

class LsTree {
    constructor(flag, treeHash) {
        this.flag = flag;
        this.treeHash = treeHash;
    }
    execute() {
        const flag = this.flag;
        const sha = this.treeHash;

        const folder = sha.slice(0, 2);
        const file = sha.slice(2);

        const folderPath = path.join(process.cwd(), '.git', 'objects', folder);
        const filePath = path.join(folderPath, file);

        if((!fs.existsSync(folderPath)) || (!fs.existsSync(filePath))) {
            throw new Error(`Not a valid object name ${sha}`);
        }

        const fileContent = fs.readFileSync(filePath);
        const outputBuffer = zlib.unzipSync(fileContent);
        const output = outputBuffer.toString().split('\0');

        const treeContent = output.slice(1).filter(e => e.includes(' '));
        const names = treeContent.map((s) => s.split(' ')[1]);
        names.sort();
        names.forEach(s => console.log(s));
    }
} 

module.exports = LsTree;