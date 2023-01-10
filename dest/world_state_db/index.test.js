"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _index = require("./index"), _worldState = require("../world_state"), _merkleTree = require("../merkle_tree"), randomFr = ()=>{
    let bytes = (0, _crypto.randomBytes)(32);
    return bytes.writeUInt32BE(0), bytes;
};
describe.skip('world_state_db', ()=>{
    let worldStateDb;
    beforeEach(async ()=>{
        (worldStateDb = new _index.WorldStateDb(`/tmp/world_state_db_${(0, _crypto.randomBytes)(32).toString('hex')}.db`)).destroy(), await worldStateDb.start();
    }), afterEach(()=>{
        worldStateDb.stop(), worldStateDb.destroy();
    }), it('should be initialized with correct metadata', ()=>{
        expect(worldStateDb.getRoot(0)).toEqual(_worldState.WorldStateConstants.EMPTY_DATA_ROOT), expect(worldStateDb.getRoot(1)).toEqual(_worldState.WorldStateConstants.EMPTY_NULL_ROOT), expect(worldStateDb.getRoot(2)).toEqual(_worldState.WorldStateConstants.EMPTY_ROOT_ROOT), expect(worldStateDb.getRoot(3)).toEqual(_worldState.WorldStateConstants.EMPTY_DEFI_ROOT), expect(worldStateDb.getSize(0)).toBe(BigInt(0)), expect(worldStateDb.getSize(1)).toBe(BigInt(0)), expect(worldStateDb.getSize(2)).toBe(BigInt(1)), expect(worldStateDb.getSize(3)).toBe(BigInt(0));
    }), it('should get correct value', async ()=>{
        let buffer = await worldStateDb.get(0, BigInt(0));
        expect(buffer).toEqual(Buffer.alloc(32, 0));
    }), it('should get correct hash path', async ()=>{
        let path = (await worldStateDb.getHashPath(0, BigInt(0))).data, expectedFirst = _merkleTree.MerkleTree.ZERO_ELEMENT, expectedLast = '02a12922daa0fe8d05620d98096220a86d9ebf4d9552dc0fbd3862b9c48f7ab9';
        expect(path.length).toEqual(32), expect(path[0][0]).toEqual(expectedFirst), expect(path[0][1]).toEqual(expectedFirst), expect(path[31][0].toString('hex')).toEqual(expectedLast), expect(path[31][1].toString('hex')).toEqual(expectedLast);
        let nullPath = (await worldStateDb.getHashPath(1, BigInt(0))).data;
        expect(nullPath.length).toEqual(256);
    }), it('should update value', async ()=>{
        let value = Buffer.alloc(32, 0);
        value.writeUInt32BE(5, 28);
        let root = await worldStateDb.put(0, BigInt(0), value), result = await worldStateDb.get(0, BigInt(0));
        expect(result).toEqual(value), expect(worldStateDb.getRoot(0)).toEqual(root), expect(worldStateDb.getSize(0)).toEqual(BigInt(1));
    }), it('should update multiple values', async ()=>{
        let values = Array(1024).fill(0).map(randomFr);
        for(let i = 0; i < 1024; ++i)await worldStateDb.put(0, BigInt(i), values[i]);
        for(let i1 = 0; i1 < 1024; ++i1){
            let result = await worldStateDb.get(0, BigInt(i1));
            expect(result).toEqual(values[i1]);
        }
        expect(worldStateDb.getSize(0)).toEqual(BigInt(1024));
    }, 60000), it('should update same value in both trees', async ()=>{
        let value1 = randomFr(), value2 = randomFr();
        await worldStateDb.put(0, BigInt(10), value1), await worldStateDb.put(1, BigInt(10), value2);
        let result1 = await worldStateDb.get(0, BigInt(10)), result2 = await worldStateDb.get(1, BigInt(10));
        expect(result1).toEqual(value1), expect(result2).toEqual(value2);
    }), it('should be able to rollback to the previous commit', async ()=>{
        let values = [
            ,
            ,
            , 
        ].fill(0).map(randomFr), rootEmpty = worldStateDb.getRoot(0);
        await worldStateDb.put(0, BigInt(0), values[0]), expect(worldStateDb.getRoot(0)).not.toEqual(rootEmpty), await worldStateDb.rollback(), expect(worldStateDb.getRoot(0)).toEqual(rootEmpty), await worldStateDb.put(0, BigInt(0), values[0]), await worldStateDb.put(0, BigInt(1), values[1]), await worldStateDb.commit();
        let root2 = worldStateDb.getRoot(0);
        await worldStateDb.put(0, BigInt(2), values[2]), expect(worldStateDb.getRoot(0)).not.toEqual(root2), await worldStateDb.rollback(), expect(worldStateDb.getRoot(0)).toEqual(root2);
    }), it('should read and write standard I/O sequentially', async ()=>{
        let values = Array(10).fill(0).map(randomFr);
        await Promise.all(values.map(async (value, i)=>{
            await worldStateDb.put(0, BigInt(i), value);
        }));
        let buffers = await Promise.all(values.map((_, i)=>worldStateDb.get(0, BigInt(i))));
        for(let i = 0; i < 10; ++i)expect(buffers[i]).toEqual(values[i]);
        let hashPaths = await Promise.all(values.map((_, i)=>worldStateDb.getHashPath(0, BigInt(i))));
        for(let i1 = 0; i1 < 10; ++i1){
            let hashPath = await worldStateDb.getHashPath(0, BigInt(i1));
            expect(hashPaths[i1]).toEqual(hashPath);
        }
    });
});
