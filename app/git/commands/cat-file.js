const path = require("path");
const fs = require("fs");
const zlib = require('zlib');

class CatFile {
    constructor(flag, commitHash) {
        this.flag = flag;
        this.commitHash = commitHash;
    }

    execute() {
        const flag = this.flag;
        const commitHash = this.commitHash;

        switch (flag) {
            case "-p": {
                const folder = commitHash.slice(0, 2);
                const file = commitHash.slice(2);

                const completePath = path.join(process.cwd(), '.git', 'objects', folder, file);
                if(!fs.existsSync(completePath)) {
                    throw new Error(`Not a valid object name ${commitHash}`);
                }

                const fileContent = fs.readFileSync(completePath);
                const outBuffer = zlib.inflateSync(fileContent);
                const output = outBuffer.toString().split("\x00")[1];

                process.stdout.write(output);

            }
                break;
            default:
                break;
        }

    }
}

module.exports = CatFile;