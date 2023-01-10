import { HashPath } from './hash_path';
function keepNLsb(input, numBits) {
    return numBits >= 32 ? input : input & (1 << numBits) - 1;
}
export class MerkleTree {
    static async new(db, hasher, name, depth, initialLeafValue = MerkleTree.ZERO_ELEMENT) {
        let tree = new MerkleTree(db, hasher, name, depth, 0, void 0, initialLeafValue);
        return await tree.writeMeta(), tree;
    }
    static async fromName(db, hasher, name, initialLeafValue = MerkleTree.ZERO_ELEMENT) {
        let meta = await db.get(Buffer.from(name)), root = meta.slice(0, 32), depth = meta.readUInt32LE(32), size = meta.readUInt32LE(36);
        return new MerkleTree(db, hasher, name, depth, size, root, initialLeafValue);
    }
    async syncFromDb() {
        let meta = await this.db.get(Buffer.from(this.name));
        this.root = meta.slice(0, 32), this.depth = meta.readUInt32LE(32), this.size = meta.readUInt32LE(36);
    }
    async writeMeta(batch) {
        let data = Buffer.alloc(40);
        this.root.copy(data), data.writeUInt32LE(this.depth, 32), data.writeUInt32LE(this.size, 36), batch ? batch.put(this.name, data) : await this.db.put(this.name, data);
    }
    getRoot() {
        return this.root;
    }
    getSize() {
        return this.size;
    }
    async getHashPath(index) {
        let path = new HashPath(), data = await this.dbGet(this.root);
        for(let i = this.depth - 1; i >= 0; --i){
            if (!data) {
                path.data[i] = [
                    this.zeroHashes[i],
                    this.zeroHashes[i]
                ];
                continue;
            }
            if (data.length > 64) {
                let subtreeDepth = i + 1, layerSize = 2 ** subtreeDepth, offset = 0;
                index = keepNLsb(index, subtreeDepth);
                for(let j = 0; j < subtreeDepth; ++j){
                    index -= 0x1 & index;
                    let lhsOffset = offset + 32 * index;
                    path.data[j] = [
                        data.slice(lhsOffset, lhsOffset + 32),
                        data.slice(lhsOffset + 32, lhsOffset + 64)
                    ], offset += 32 * layerSize, layerSize >>= 1, index >>= 1;
                }
                break;
            }
            let lhs = data.slice(0, 32), rhs = data.slice(32, 64);
            path.data[i] = [
                lhs,
                rhs
            ];
            let isRight = index >> i & 0x1;
            data = await this.dbGet(isRight ? rhs : lhs);
        }
        return path;
    }
    async updateElement(index, value) {
        return await this.updateLeafHash(index, value.equals(Buffer.alloc(32, 0)) ? this.initialLeafValue : value);
    }
    async updateLeafHash(index, leafHash) {
        let batch = this.db.batch();
        this.root = await this.updateElementInternal(this.root, leafHash, index, this.depth, batch), this.size = Math.max(this.size, index + 1), await this.writeMeta(batch), await batch.write();
    }
    async updateElementInternal(root, value, index, height, batch) {
        if (0 === height) return value;
        let data = await this.dbGet(root), isRight = index >> height - 1 & 0x1, left = data ? data.slice(0, 32) : this.zeroHashes[height - 1], right = data ? data.slice(32, 64) : this.zeroHashes[height - 1], subtreeRoot = isRight ? right : left, newSubtreeRoot = await this.updateElementInternal(subtreeRoot, value, keepNLsb(index, height - 1), height - 1, batch);
        isRight ? right = newSubtreeRoot : left = newSubtreeRoot;
        let newRoot = this.hasher.compress(left, right);
        return batch.put(newRoot, Buffer.concat([
            left,
            right
        ])), root.equals(newRoot) || batch.del(root), newRoot;
    }
    async updateElements(index, values) {
        let zeroBuf = Buffer.alloc(32, 0);
        return await this.updateLeafHashes(index, values.map((v)=>v.equals(zeroBuf) ? this.initialLeafValue : v));
    }
    async updateLeafHashes(index, leafHashes) {
        for(; leafHashes.length;){
            let batch = this.db.batch(), subtreeDepth = Math.ceil(Math.log2(leafHashes.length)), subtreeSize = 2 ** subtreeDepth;
            for(; leafHashes.length < subtreeSize || index % subtreeSize != 0;)subtreeSize >>= 1, subtreeDepth--;
            let toInsert = leafHashes.slice(0, subtreeSize), hashes = await this.hasher.hashToTree(toInsert);
            this.root = await this.updateElementsInternal(this.root, hashes, index, this.depth, subtreeDepth, batch), leafHashes = leafHashes.slice(subtreeSize), index += subtreeSize, this.size = index, await this.writeMeta(batch), await batch.write();
        }
    }
    async updateElementsInternal(root, hashes, index, height, subtreeHeight, batch) {
        if (height === subtreeHeight) {
            let root1 = hashes.pop();
            return batch.put(root1, Buffer.concat(hashes)), root1;
        }
        if (hashes[hashes.length - 1].equals(this.zeroHashes[height - 1])) return root;
        let data = await this.dbGet(root), isRight = index >> height - 1 & 0x1;
        if (data && data.length > 64) {
            if (!root.equals(hashes[hashes.length - 1])) throw Error('Attempting to update pre-existing subtree.');
            return root;
        }
        let left = data ? data.slice(0, 32) : this.zeroHashes[height - 1], right = data ? data.slice(32, 64) : this.zeroHashes[height - 1], subtreeRoot = isRight ? right : left, newSubtreeRoot = await this.updateElementsInternal(subtreeRoot, hashes, keepNLsb(index, height - 1), height - 1, subtreeHeight, batch);
        isRight ? right = newSubtreeRoot : left = newSubtreeRoot;
        let newRoot = this.hasher.compress(left, right);
        return batch.put(newRoot, Buffer.concat([
            left,
            right
        ])), root.equals(newRoot) || batch.del(root), newRoot;
    }
    async dbGet(key) {
        return await this.db.get(key).catch(()=>{});
    }
    constructor(db, hasher, name, depth, size = 0, root, initialLeafValue = MerkleTree.ZERO_ELEMENT){
        if (this.db = db, this.hasher = hasher, this.name = name, this.depth = depth, this.size = size, this.initialLeafValue = initialLeafValue, this.zeroHashes = [], !(depth >= 1 && depth <= 32)) throw Error('Bad depth');
        let current = initialLeafValue;
        for(let i = 0; i < depth; ++i)this.zeroHashes[i] = current, current = hasher.compress(current, current);
        this.root = root || current;
    }
}
MerkleTree.ZERO_ELEMENT = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
