const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

class CommitTree {
    constructor(treeSha, parent, msg) {
        this.treeSha = treeSha;
        this.parent = parent;
        this.msg = msg;
    }

    execute() {
        let commitContentBuffer;
        if(this.parent) {
            commitContentBuffer = Buffer.concat([
                Buffer.from(`tree ${this.treeSha}\n`), 
                Buffer.from(`parent ${this.parent}\n`),
                Buffer.from(`author Samarth <patelsamarth233@gmail.com> ${Date.now()} +0000\n`),
                Buffer.from(`Committer Samarth <patelsamarth233@gmail.com> ${Date.now()} +0000\n\n`),
                Buffer.from(`${this.msg}\n`),
            ])
        }
        else {
            commitContentBuffer = Buffer.concat([
                Buffer.from(`tree ${this.treeSha}\n`), 
                Buffer.from(`author Samarth <patelsamarth233@gmail.com> ${Date.now()} +0000\n`),
                Buffer.from(`Committer Samarth <patelsamarth233@gmail.com> ${Date.now()} +0000\n\n`),
                Buffer.from(`${this.msg}\n`),
            ])
        }

        const header = `commit ${commitContentBuffer.length}\0`;
        const data = Buffer.concat([Buffer.from(header), commitContentBuffer]);

        const hash = crypto.createHash('sha1').update(data).digest('hex');

        const folder = hash.slice(0, 2);
        const file = hash.slice(2);

        const completeFolderPath = path.join(process.cwd(), ".git", "objects", folder);

        if(!fs.existsSync(completeFolderPath)) fs.mkdirSync(completeFolderPath);

        const compressedData = zlib.deflateSync(data);

        fs.writeFileSync(path.join(completeFolderPath, file), compressedData);

        process.stdout.write(hash);
    }
}

module.exports = CommitTree;