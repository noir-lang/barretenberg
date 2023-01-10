import { MemoryMerkleTree } from './memory_merkle_tree';
import { HashPath } from './hash_path';
import { BarretenbergWasm } from '../wasm';
import { SinglePedersen } from '../crypto';
let expectSameTrees = (tree1, tree2)=>{
    let size = tree1.getSize();
    expect(size).toBe(tree2.getSize()), expect(tree1.getRoot().toString('hex')).toBe(tree2.getRoot().toString('hex'));
    for(let i = 0; i < size; ++i){
        let hashPath1 = tree1.getHashPath(i), hashPath2 = tree2.getHashPath(i);
        expect(hashPath2).toStrictEqual(hashPath1);
    }
};
describe('memory_merkle_tree', ()=>{
    let barretenberg, pedersen;
    let values = [];
    beforeAll(async ()=>{
        await (barretenberg = new BarretenbergWasm()).init(), pedersen = new SinglePedersen(barretenberg);
        for(let i = 0; i < 4; ++i){
            let v = Buffer.alloc(32, 0);
            v.writeUInt32BE(i, 28), values[i] = v;
        }
    }), it('should throw if size is not power of 2', async ()=>{
        await expect(async ()=>{
            await MemoryMerkleTree.new(values.slice(0, 3), pedersen);
        }).rejects.toThrow('MemoryMerkleTree can only handle powers of 2.');
    }), it('should have correct root', async ()=>{
        let e00 = MemoryMerkleTree.ZERO_ELEMENT, e01 = values[1], e02 = values[2], e03 = values[3], e10 = pedersen.compress(e00, e01), e11 = pedersen.compress(e02, e03), root = pedersen.compress(e10, e11), tree = await MemoryMerkleTree.new([
            e00,
            e01,
            e02,
            e03
        ], pedersen), expected = new HashPath([
            [
                e00,
                e01
            ],
            [
                e10,
                e11
            ]
        ]);
        expect(tree.getHashPath(0)).toEqual(expected), expect(tree.getHashPath(1)).toEqual(expected), expected = new HashPath([
            [
                e02,
                e03
            ],
            [
                e10,
                e11
            ]
        ]), expect(tree.getHashPath(2)).toEqual(expected), expect(tree.getHashPath(3)).toEqual(expected), expect(tree.getRoot()).toEqual(root), expect(tree.getSize()).toBe(4), expect(root.toString('hex')).toEqual('0bf2e78afd70f72b0e6eafb03c41faef167a82441b05e517cdf35d813302061f');
    }), it('should have correct empty tree root for depth 10', async ()=>{
        let notes = Array(1024).fill(MemoryMerkleTree.ZERO_ELEMENT), tree = await MemoryMerkleTree.new(notes, pedersen), root = tree.getRoot();
        expect(root.toString('hex')).toEqual('00f693a5e1272c9ae056875a8ef2776cc539ac5125db50548d77be4bad9a76f8');
    }), it('should throw if hash path requested for invalid index', async ()=>{
        let notes = Array(1024).fill(MemoryMerkleTree.ZERO_ELEMENT), tree = await MemoryMerkleTree.new(notes, pedersen);
        expect(()=>{
            tree.getHashPath(1025);
        }).toThrow('Index out of bounds'), expect(()=>{
            tree.getHashPath(-1);
        }).toThrow('Index out of bounds'), expect(()=>{
            tree.getHashPath(1.1);
        }).toThrow('Index invalid');
    }), it('trees with same values should be identical', async ()=>{
        let notes = Array(1024).fill(MemoryMerkleTree.ZERO_ELEMENT), tree1 = await MemoryMerkleTree.new(notes, pedersen), tree2 = await MemoryMerkleTree.new(notes, pedersen);
        expectSameTrees(tree1, tree2);
    });
});
