import { MerkleTree, MemoryMerkleTree, HashPath } from '../merkle_tree';
import { WorldStateConstants } from './world_state_constants';
import { createDebugLogger } from '../log';
let debug = createDebugLogger('bb:world_state');
export class WorldState {
    async init(subTreeDepth) {
        this.subTreeDepth = subTreeDepth;
        let zeroNotes = Array(1 << subTreeDepth).fill(MemoryMerkleTree.ZERO_ELEMENT), subTree = await MemoryMerkleTree.new(zeroNotes, this.pedersen), treeSize = WorldStateConstants.DATA_TREE_DEPTH - subTreeDepth, subTreeRoot = subTree.getRoot();
        debug(`initialising data tree with depth ${treeSize} and zero element of ${subTreeRoot.toString('hex')}`);
        try {
            this.tree = await MerkleTree.fromName(this.db, this.pedersen, 'data', subTreeRoot);
        } catch (e) {
            this.tree = await MerkleTree.new(this.db, this.pedersen, 'data', treeSize, subTreeRoot);
        }
        this.logTreeStats();
    }
    buildZeroHashPath(depth = WorldStateConstants.DATA_TREE_DEPTH) {
        let current = MemoryMerkleTree.ZERO_ELEMENT, bufs = [];
        for(let i = 0; i < depth; i++)bufs.push([
            current,
            current
        ]), current = this.pedersen.compress(current, current);
        return new HashPath(bufs);
    }
    convertNoteIndexToSubTreeIndex(noteIndex) {
        return noteIndex >> this.subTreeDepth;
    }
    async buildFullHashPath(noteIndex, immutableHashPath) {
        let noteSubTreeIndex = this.convertNoteIndexToSubTreeIndex(noteIndex), mutablePath = await this.getHashPath(noteSubTreeIndex), fullHashPath = new HashPath(immutableHashPath.data.concat(mutablePath.data));
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
