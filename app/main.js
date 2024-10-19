const fs = require("fs");
const path = require("path");

const GitClient = require("./git/commands/client")

const {
    Init,
    CatFile,
    HashObject,
    LsTree,
    WriteTree,
    CommitTree
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
    case "ls-tree":
        handleLsTree();
        break;
    case "write-tree":
        handleWriteTree();
        break;
    case "commit-tree":
        handleCommitTree();
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

function handleLsTree() {
    let flag = process.argv[3];
    let treeHash = process.argv[4];
    if(!treeHash && flag == "--name-only") return;
    if(!treeHash) {
        treeHash = flag;
        flag = null;
    }

    const command = new LsTree(flag, treeHash);
    gitClient.run(command);
}

function handleWriteTree() {
    const command = new WriteTree();
    gitClient.run(command);
}

function handleCommitTree() {
    let treeSha = process.argv[3];
    let parent = process.argv[5];
    let msg = process.argv[7];

    if(!msg) {
        msg = parent;
        parent = null;
    }

    const command = new CommitTree(treeSha, parent, msg);
    gitClient.run(command);
}