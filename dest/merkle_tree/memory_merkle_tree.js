"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "MemoryMerkleTree", {
    enumerable: !0,
    get: ()=>MemoryMerkleTree
});
const _hashPath = require("./hash_path");
class MemoryMerkleTree {
    getHashPath(index) {
        if (index < 0 || index >= this.notes.length) throw Error('Index out of bounds');
        if (!Number.isInteger(index)) throw Error('Index invalid');
        let hashPath = [], layerSize = this.notes.length, offset = 0;
        for(; layerSize > 1;){
            let hashIndex = index + offset;
            offset += layerSize;
            let hashes = index % 2 ? [
                this.hashes[hashIndex - 1],
                this.hashes[hashIndex]
            ] : [
                this.hashes[hashIndex],
                this.hashes[hashIndex + 1]
            ];
            hashPath.push(hashes), index >>= 1, layerSize >>= 1;
        }
        return new _hashPath.HashPath(hashPath);
    }
    getRoot() {
        return this.hashes[this.hashes.length - 1];
    }
    getSize() {
        return this.notes.length;
    }
    static async new(notes, hasher) {
        let tree = new MemoryMerkleTree(notes, hasher);
        return await tree.buildTree(), tree;
    }
    async buildTree() {
        this.hashes = await this.hasher.hashToTree(this.notes);
    }
    constructor(notes, hasher){
        var v;
        if (this.notes = notes, this.hasher = hasher, this.hashes = [], !((v = notes.length) && !(v & v - 1))) throw Error('MemoryMerkleTree can only handle powers of 2.');
    }
}
MemoryMerkleTree.ZERO_ELEMENT = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
