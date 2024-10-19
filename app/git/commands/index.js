const Init = require('./init')
const CatFile = require("./cat-file")
const HashObject = require('./hash-object')
const LsTree = require('./ls-tree')
const WriteTree = require('./write-tree')
const CommitTree = require('./commit-tree')

module.exports = {
    Init,
    CatFile,
    HashObject,
    LsTree,
    WriteTree,
    CommitTree
}