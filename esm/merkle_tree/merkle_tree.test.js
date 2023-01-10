import levelup from 'levelup';
import memdown from 'memdown';
import { HashPath, MerkleTree } from '.';
import { SinglePedersen } from '../crypto/pedersen';
import { BarretenbergWasm } from '../wasm';
let expectSameTrees = async (tree1, tree2)=>{
    let size = tree1.getSize();
    expect(size).toBe(tree2.getSize()), expect(tree1.getRoot().toString('hex')).toBe(tree2.getRoot().toString('hex'));
    for(let i = 0; i < size; ++i){
        let hashPath1 = await tree1.getHashPath(i), hashPath2 = await tree2.getHashPath(i);
        expect(hashPath2).toStrictEqual(hashPath1);
    }
};
describe('merkle_tree', ()=>{
    let barretenberg, pedersen;
    let values = [];
    beforeAll(async ()=>{
        await (barretenberg = new BarretenbergWasm()).init(), pedersen = new SinglePedersen(barretenberg);
        for(let i = 0; i < 32; ++i){
            let v = Buffer.alloc(32, 0);
            v.writeUInt32BE(i, 28), values[i] = v;
        }
    }), it('should have correct root', async ()=>{
        let db = levelup(memdown()), e00 = MerkleTree.ZERO_ELEMENT, e01 = values[1], e02 = values[2], e03 = values[3], e10 = pedersen.compress(e00, e01), e11 = pedersen.compress(e02, e03), root = pedersen.compress(e10, e11), tree = await MerkleTree.new(db, pedersen, 'test', 2);
        for(let i = 0; i < 4; ++i)await tree.updateElement(i, values[i]);
        let expected = new HashPath([
            [
                e00,
                e01
            ],
            [
                e10,
                e11
            ]
        ]);
        expect(await tree.getHashPath(0)).toEqual(expected), expect(await tree.getHashPath(1)).toEqual(expected), expected = new HashPath([
            [
                e02,
                e03
            ],
            [
                e10,
                e11
            ]
        ]), expect(await tree.getHashPath(2)).toEqual(expected), expect(await tree.getHashPath(3)).toEqual(expected), expect(tree.getRoot()).toEqual(root), expect(tree.getSize()).toBe(4), expect(root.toString('hex')).toEqual('0bf2e78afd70f72b0e6eafb03c41faef167a82441b05e517cdf35d813302061f');
    }), it('should have correct empty tree root for depth 32', async ()=>{
        let db = levelup(memdown()), tree = await MerkleTree.new(db, pedersen, 'test', 32), root = tree.getRoot();
        expect(root.toString('hex')).toEqual('18ceb5cd201e1cee669a5c3ad96d3c4e933a365b37046fc3178264bede32c68d');
    }), it('should have same result when setting same values', async ()=>{
        let db = levelup(memdown()), tree = await MerkleTree.new(db, pedersen, 'test', 10);
        for(let i = 0; i < values.length; ++i)await tree.updateElement(i, values[i]);
        let root1 = tree.getRoot();
        for(let i1 = 0; i1 < values.length; ++i1)await tree.updateElement(i1, values[i1]);
        let root2 = tree.getRoot();
        expect(root1).toEqual(root2);
    }), it('should get same result when using subtree insertion', async ()=>{
        let values = [];
        for(let i = 0; i < 256; ++i){
            let v = Buffer.alloc(32, 0);
            v.writeUInt32BE(i, 28), values[i] = v;
        }
        let db1 = levelup(memdown()), tree1 = await MerkleTree.new(db1, pedersen, 'test', 10);
        for(let i1 = 0; i1 < values.length; ++i1)await tree1.updateElement(i1, values[i1]);
        let db2 = levelup(memdown()), tree2 = await MerkleTree.new(db2, pedersen, 'test', 10);
        for(let i2 = 0; i2 < values.length; i2 += 32)await tree2.updateElements(i2, values.slice(i2, i2 + 32));
        await expectSameTrees(tree1, tree2);
    }), it('should support batch insertion of a single element', async ()=>{
        let values = [];
        for(let i = 0; i < 64; ++i){
            let v = Buffer.alloc(32, 0);
            v.writeUInt32BE(i, 28), values[i] = v;
        }
        let db1 = levelup(memdown()), tree1 = await MerkleTree.new(db1, pedersen, 'test', 10);
        for(let i1 = 0; i1 < values.length; ++i1)await tree1.updateElement(i1, values[i1]);
        let db2 = levelup(memdown()), tree2 = await MerkleTree.new(db2, pedersen, 'test', 10);
        for(let i2 = 0; i2 < values.length; i2++)await tree2.updateElements(i2, values.slice(i2, i2 + 1));
        await expectSameTrees(tree1, tree2);
    }), it('should update elements without over extending tree size', async ()=>{
        let db1 = levelup(memdown()), tree1 = await MerkleTree.new(db1, pedersen, 'test', 10);
        for(let i = 0; i < 29; ++i)await tree1.updateElement(i, values[i]);
        let db2 = levelup(memdown()), tree2 = await MerkleTree.new(db2, pedersen, 'test', 10);
        await tree2.updateElements(0, values.slice(0, 7)), await tree2.updateElements(7, values.slice(7, 29)), await expectSameTrees(tree1, tree2);
    }), it('should update elements, simulating escape hatch behaviour', async ()=>{
        let db1 = levelup(memdown()), tree1 = await MerkleTree.new(db1, pedersen, 'test', 10);
        for(let i = 0; i < 10; ++i)await tree1.updateElement(i, values[i]);
        for(let i1 = 16; i1 < 24; ++i1)await tree1.updateElement(i1, values[i1]);
        let db2 = levelup(memdown()), tree2 = await MerkleTree.new(db2, pedersen, 'test', 10);
        await tree2.updateElements(0, values.slice(0, 8)), await tree2.updateElements(8, values.slice(8, 10)), await tree2.updateElements(16, values.slice(16, 24)), await expectSameTrees(tree1, tree2);
    }), it('should update 0 values elements', async ()=>{
        let values = Array(6).fill(Buffer.alloc(32, 0)), db1 = levelup(memdown()), tree1 = await MerkleTree.new(db1, pedersen, 'test', 10);
        for(let i = 0; i < 6; ++i)await tree1.updateElement(i, values[i]);
        let db2 = levelup(memdown()), tree2 = await MerkleTree.new(db2, pedersen, 'test', 10);
        await tree2.updateElements(0, values.slice(0, 6)), expect(tree2.getSize()).toEqual(6), await expectSameTrees(tree1, tree2);
    }), it('should allow inserting same subtree twice', async ()=>{
        let values = [];
        for(let i = 0; i < 64; ++i){
            let v = Buffer.alloc(64, 0);
            v.writeUInt32LE(i, 0), values[i] = v;
        }
        let db1 = levelup(memdown()), tree1 = await MerkleTree.new(db1, pedersen, 'test', 10);
        await tree1.updateElements(0, values);
        let db2 = levelup(memdown()), tree2 = await MerkleTree.new(db2, pedersen, 'test', 10);
        await tree2.updateElements(0, values), await tree2.updateElements(0, values), await expectSameTrees(tree1, tree2);
    }), it('should allow inserting of larger subtree over smaller subtree', async ()=>{
        let values = [];
        for(let i = 0; i < 65; ++i){
            let v = Buffer.alloc(64, 0);
            v.writeUInt32LE(i, 0), values[i] = v;
        }
        let db1 = levelup(memdown()), tree1 = await MerkleTree.new(db1, pedersen, 'test', 10);
        await tree1.updateElements(0, values);
        let db2 = levelup(memdown()), tree2 = await MerkleTree.new(db2, pedersen, 'test', 10);
        await tree2.updateElements(0, values.slice(0, 58)), await tree2.updateElements(0, values), await expectSameTrees(tree1, tree2);
    }), it('should be able to restore from previous data', async ()=>{
        let levelDown = memdown(), db = levelup(levelDown), tree = await MerkleTree.new(db, pedersen, 'test', 10);
        for(let i = 0; i < 4; ++i)await tree.updateElement(i, values[i]);
        let db2 = levelup(levelDown), tree2 = await MerkleTree.fromName(db2, pedersen, 'test');
        expect(tree.getRoot()).toEqual(tree2.getRoot());
        for(let i1 = 0; i1 < 4; ++i1)expect(await tree.getHashPath(i1)).toEqual(await tree2.getHashPath(i1));
    }), it('should throw an error if previous data does not exist for the given name', async ()=>{
        let db = levelup(memdown());
        await expect((async ()=>{
            await MerkleTree.fromName(db, pedersen, 'a_whole_new_tree');
        })()).rejects.toThrow();
    }), it('should be able to sync the latest status from db', async ()=>{
        let levelDown = memdown(), db1 = levelup(levelDown), tree1 = await MerkleTree.new(db1, pedersen, 'test', 10), db2 = levelup(levelDown), tree2 = await MerkleTree.new(db2, pedersen, 'test', 10);
        expect(tree1.getRoot()).toEqual(tree2.getRoot()), expect(tree1.getSize()).toBe(0), expect(tree2.getSize()).toBe(0);
        for(let i = 0; i < 4; ++i)await tree1.updateElement(i, values[i]);
        let newRoot = tree1.getRoot();
        expect(tree1.getSize()).toBe(4), expect(tree2.getRoot()).not.toEqual(newRoot), expect(tree2.getSize()).toBe(0), await tree2.syncFromDb(), expect(tree2.getRoot()).toEqual(newRoot), expect(tree2.getSize()).toBe(4);
    }), it('should serialize hash path data to a buffer and be able to deserialize it back', async ()=>{
        let db = levelup(memdown()), tree = await MerkleTree.new(db, pedersen, 'test', 10);
        await tree.updateElement(0, values[0]);
        let hashPath = await tree.getHashPath(0), buf = hashPath.toBuffer(), recovered = HashPath.fromBuffer(buf);
        expect(recovered).toEqual(hashPath);
        let deserialized = HashPath.deserialize(buf);
        expect(deserialized.elem).toEqual(hashPath), expect(deserialized.adv).toBe(644);
        let dummyData = Buffer.alloc(23, 1), paddedBuf = Buffer.concat([
            dummyData,
            buf
        ]), recovered2 = HashPath.fromBuffer(paddedBuf, 23);
        expect(recovered2).toEqual(hashPath);
        let deserialized2 = HashPath.deserialize(buf);
        expect(deserialized2.elem).toEqual(hashPath), expect(deserialized2.adv).toBe(644);
    });
});
