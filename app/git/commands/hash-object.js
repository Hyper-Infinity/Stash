const path = require('path');
const fs = require("fs");
const crypto = require('crypto');
const zlib = require('zlib');

class HashObject {
    constructor(flag, filePath) {
        this.flag = flag;
        this.filePath = filePath;
    }

    execute() {
        const filePath = path.resolve(this.filePath);

        if(!fs.existsSync(filePath)) {
            throw new Error(`could not open ${this.filePath} for reading: No such file or directory!`);
        }

        const fileContents = fs.readFileSync(filePath);
        const fileLength = fileContents.length;

        const header = `blob ${fileLength}\0`
        const blob = Buffer.concat([Buffer.from(header), fileContents]);

        const  hash = crypto.createHash('sha1').update(blob).digest('hex');

        if(this.flag && this.flag === '-w') {
            const folder = hash.slice(0, 2);
            const file = hash.slice(2);

            const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);

            if(!fs.existsSync(completeFolderPath)) {
                fs.mkdirSync(completeFolderPath);
            }

            const compressedFileData = zlib.deflateSync(blob);

            fs.writeFileSync(path.join(completeFolderPath, file), compressedFileData);
        }

        process.stdout.write(hash);
    }
}

module.exports = HashObject;