const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

function writeFileBlob(filePath) {
    const fileContents = fs.readFileSync(filePath);
    const fileLength = fileContents.length;

    const header = `blob ${fileLength}\0`
    const blob = Buffer.concat([Buffer.from(header), fileContents]);

    const  hash = crypto.createHash('sha1').update(blob).digest('hex');

    const folder = hash.slice(0, 2);
    const file = hash.slice(2);

    const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);

    if(!fs.existsSync(completeFolderPath)) {
        fs.mkdirSync(completeFolderPath);
    }

    const compressedFileData = zlib.deflateSync(blob);

    fs.writeFileSync(path.join(completeFolderPath, file), compressedFileData);

    return hash;
}

class WriteTree {
    constructor() {}
    execute() {
        function CreateTree(basePath) {
            const dirContents = fs.readdirSync(basePath);
            const ans = [];
            for(const item of dirContents) {
                if(item.includes(".git")) {
                    continue;
                }

                const currPath = path.join(basePath, item);
                const stat = fs.statSync(currPath);

                if(stat.isDirectory()) {
                    const treeSha = CreateTree(currPath);
                    if(treeSha) {
                        ans.push({code: "40000", basename: path.basename(currPath), sha: treeSha});
                    }
                }
                else if(stat.isFile()) {
                    const fileSha = writeFileBlob(currPath);
                    ans.push({code: "100644", basename: path.basename(currPath), sha: fileSha});
                }
            }

            if(dirContents.length === 0 || ans.length === 0) 
                return null;

            const treeData = ans.reduce((acc, curr) => {
                const {code, basename, sha} = curr;
                return Buffer.concat([acc, Buffer.from(`${code} ${basename}\0`), Buffer.from(sha, "hex")])
            }, Buffer.alloc[0]);

            const tree = Buffer.concat([Buffer.from(`tree ${treeData.length}`), treeData]);

            const hash = crypto.createHash('sha1').update(tree).digest('hex');

            const folder = hash.slice(0, 2);
            const file = hash.slice(2);

            const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);

            if(!fs.existsSync(completeFolderPath)) {
                fs.mkdirSync(completeFolderPath);
            }

            const compressedTreeData = zlib.deflateSync(tree);

            fs.writeFileSync(path.join(completeFolderPath, file), compressedTreeData);

            return hash;
        }

        const sha = CreateTree(process.cwd());
        process.stdout.write(sha);
    }
}

module.exports = WriteTree;