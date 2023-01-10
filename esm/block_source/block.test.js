import { randomBytes } from 'crypto';
import { Block } from '.';
import { TxHash } from '../blockchain';
import { Deserializer, serializeBufferArrayToVector } from '../serialize';
describe('block tests', ()=>{
    it('should serialize and deserialize block', ()=>{
        let block = new Block(new TxHash(randomBytes(32)), new Date(), 1, 2, randomBytes(123), [], [], 789, BigInt(101112)), buf = block.toBuffer(), block2 = Block.fromBuffer(buf);
        expect(block2).toEqual(block);
    }), it('should serialize and deserialize block array', ()=>{
        let block = new Block(new TxHash(randomBytes(32)), new Date(), 1, 2, randomBytes(123), [], [], 789, BigInt(101112)), arr = [
            block,
            block,
            block
        ], buf = serializeBufferArrayToVector(arr.map((b)=>b.toBuffer())), des = new Deserializer(buf), arr2 = des.deserializeArray(Block.deserialize);
        expect(arr2).toEqual(arr);
    });
});
