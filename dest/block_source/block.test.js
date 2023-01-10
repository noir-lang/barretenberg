"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _ = require("."), _blockchain = require("../blockchain"), _serialize = require("../serialize");
describe('block tests', ()=>{
    it('should serialize and deserialize block', ()=>{
        let block = new _.Block(new _blockchain.TxHash((0, _crypto.randomBytes)(32)), new Date(), 1, 2, (0, _crypto.randomBytes)(123), [], [], 789, BigInt(101112)), buf = block.toBuffer(), block2 = _.Block.fromBuffer(buf);
        expect(block2).toEqual(block);
    }), it('should serialize and deserialize block array', ()=>{
        let block = new _.Block(new _blockchain.TxHash((0, _crypto.randomBytes)(32)), new Date(), 1, 2, (0, _crypto.randomBytes)(123), [], [], 789, BigInt(101112)), arr = [
            block,
            block,
            block
        ], buf = (0, _serialize.serializeBufferArrayToVector)(arr.map((b)=>b.toBuffer())), des = new _serialize.Deserializer(buf), arr2 = des.deserializeArray(_.Block.deserialize);
        expect(arr2).toEqual(arr);
    });
});
