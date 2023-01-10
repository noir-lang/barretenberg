"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("../crypto"), _viewingKey = require("../viewing_key"), _offchainJoinSplitData = require("./offchain_join_split_data");
describe('OffchainJoinSplitData', ()=>{
    it('convert offchain join split data to and from buffer', ()=>{
        let userData = new _offchainJoinSplitData.OffchainJoinSplitData([
            _viewingKey.ViewingKey.random(),
            _viewingKey.ViewingKey.random()
        ], 123), buf = userData.toBuffer();
        expect(buf.length).toBe(_offchainJoinSplitData.OffchainJoinSplitData.SIZE), expect(_offchainJoinSplitData.OffchainJoinSplitData.fromBuffer(buf)).toEqual(userData);
    }), it('throw if number of viewing keys is wrong', ()=>{
        expect(()=>new _offchainJoinSplitData.OffchainJoinSplitData([], 123)).toThrow(), expect(()=>new _offchainJoinSplitData.OffchainJoinSplitData([
                _viewingKey.ViewingKey.random(),
                _viewingKey.ViewingKey.random(),
                _viewingKey.ViewingKey.random()
            ], 123)).toThrow();
    }), it('throw if at least one of the viewing keys is empty', ()=>{
        expect(()=>new _offchainJoinSplitData.OffchainJoinSplitData([
                _viewingKey.ViewingKey.EMPTY,
                _viewingKey.ViewingKey.random()
            ], 123)).toThrow(), expect(()=>new _offchainJoinSplitData.OffchainJoinSplitData([
                _viewingKey.ViewingKey.random(),
                _viewingKey.ViewingKey.EMPTY
            ], 123)).toThrow(), expect(()=>new _offchainJoinSplitData.OffchainJoinSplitData([
                _viewingKey.ViewingKey.EMPTY,
                _viewingKey.ViewingKey.EMPTY
            ], 123)).toThrow();
    }), it('throw if buffer size is wrong', ()=>{
        expect(()=>_offchainJoinSplitData.OffchainJoinSplitData.fromBuffer((0, _crypto.randomBytes)(_offchainJoinSplitData.OffchainJoinSplitData.SIZE - 1))).toThrow(), expect(()=>_offchainJoinSplitData.OffchainJoinSplitData.fromBuffer((0, _crypto.randomBytes)(_offchainJoinSplitData.OffchainJoinSplitData.SIZE + 1))).toThrow();
    });
});
