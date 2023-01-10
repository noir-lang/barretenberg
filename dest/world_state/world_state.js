"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "WorldState", {
    enumerable: !0,
    get: ()=>WorldState
});
const _merkleTree = require("../merkle_tree"), _worldStateConstants = require("./world_state_constants"), _log = require("../log"), debug = (0, _log.createDebugLogger)('bb:world_state');
class WorldState {
    async init(subTreeDepth) {
        this.subTreeDepth = subTreeDepth;
        let zeroNotes = Array(1 << subTreeDepth).fill(_merkleTree.MemoryMerkleTree.ZERO_ELEMENT), subTree = await _merkleTree.MemoryMerkleTree.new(zeroNotes, this.pedersen), treeSize = _worldStateConstants.WorldStateConstants.DATA_TREE_DEPTH - subTreeDepth, subTreeRoot = subTree.getRoot();
        debug(`initialising data tree with depth ${treeSize} and zero element of ${subTreeRoot.toString('hex')}`);
        try {
            this.tree = await _merkleTree.MerkleTree.fromName(this.db, this.pedersen, 'data', subTreeRoot);
        } catch (e) {
            this.tree = await _merkleTree.MerkleTree.new(this.db, this.pedersen, 'data', treeSize, subTreeRoot);
        }
        this.logTreeStats();
    }
    buildZeroHashPath(depth = _worldStateConstants.WorldStateConstants.DATA_TREE_DEPTH) {
        let current = _merkleTree.MemoryMerkleTree.ZERO_ELEMENT, bufs = [];
        for(let i = 0; i < depth; i++)bufs.push([
            current,
            current
        ]), current = this.pedersen.compress(current, current);
        return new _merkleTree.HashPath(bufs);
    }
    convertNoteIndexToSubTreeIndex(noteIndex) {
        return noteIndex >> this.subTreeDepth;
    }
    async buildFullHashPath(noteIndex, immutableHashPath) {
        let noteSubTreeIndex = this.convertNoteIndexToSubTreeIndex(noteIndex), mutablePath = await this.getHashPath(noteSubTreeIndex), fullHashPath = new _merkleTree.HashPath(immutableHashPath.data.concat(mutablePath.data));
        return fullHashPath;
    }
    async insertElement(index, element) {
        let subRootIndex = this.convertNoteIndexToSubTreeIndex(index);
        await this.tree.updateElement(subRootIndex, element), this.logTreeStats();
    }
    async insertElements(startIndex, elements) {
        let subRootIndex = this.convertNoteIndexToSubTreeIndex(startIndex);
        await this.tree.updateElements(subRootIndex, elements), this.logTreeStats();
    }
    logTreeStats() {
        debug(`data size: ${this.tree.getSize()}`), debug(`data root: ${this.tree.getRoot().toString('hex')}`);
    }
    async syncFromDb() {
        await this.tree.syncFromDb();
    }
    async getHashPath(index) {
        return await this.tree.getHashPath(index);
    }
    getRoot() {
        return this.tree.getRoot();
    }
    getSize() {
        return this.tree.getSize();
    }
    constructor(db, pedersen){
        this.db = db, this.pedersen = pedersen, this.subTreeDepth = 0;
    }
}
