const fs = require("fs");
const path = require("path");

const GitClient = require("./git/commands/client")

const {
    Init,
    CatFile,
    HashObject
} = require("./git/commands")

const gitClient = new GitClient();
const command = process.argv[2];

switch (command) {
    case "init":
        createGitDirectory();
        break;
    case "cat-file":
        handleCatFile();
        break;
    case "hash-object":
        handleHashObject();
        break;
    default:
        throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
    const command = new Init();
    gitClient.run(command);
}

function handleCatFile() {
    const flag = process.argv[3];
    const commitHash = process.argv[4];

    const command = new CatFile(flag, commitHash);
    gitClient.run(command);
}

function handleHashObject() {
    let flag = process.argv[3];
    let filePath = process.argv[4];
    if(!filePath) {
        filePath = flag;
        flag = null;
    }
    const command = new HashObject(flag, filePath);
    gitClient.run(command);
}