"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _accountId = require("../account_id"), _address = require("../address"), _offchainAccountData = require("./offchain_account_data");
describe('OffchainAccountData', ()=>{
    it('convert offchain account data to and from buffer', ()=>{
        let userData = new _offchainAccountData.OffchainAccountData(_address.GrumpkinAddress.random(), _accountId.AliasHash.random(), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), 123), buf = userData.toBuffer();
        expect(buf.length).toBe(_offchainAccountData.OffchainAccountData.SIZE), expect(_offchainAccountData.OffchainAccountData.fromBuffer(buf)).toEqual(userData);
    }), it('both spending keys are optional', ()=>{
        [
            [
                void 0,
                (0, _crypto.randomBytes)(32)
            ],
            [
                (0, _crypto.randomBytes)(32),
                void 0
            ],
            [
                void 0,
                void 0
            ]
        ].forEach(([key1, key2])=>{
            let userData = new _offchainAccountData.OffchainAccountData(_address.GrumpkinAddress.random(), _accountId.AliasHash.random(), key1, key2, 123), buf = userData.toBuffer();
            expect(buf.length).toBe(_offchainAccountData.OffchainAccountData.SIZE), expect(_offchainAccountData.OffchainAccountData.fromBuffer(buf)).toEqual(userData);
        });
    }), it('throw if spending key is not 32 bytes', ()=>{
        expect(()=>new _offchainAccountData.OffchainAccountData(_address.GrumpkinAddress.random(), _accountId.AliasHash.random(), (0, _crypto.randomBytes)(33), (0, _crypto.randomBytes)(32))).toThrow(), expect(()=>new _offchainAccountData.OffchainAccountData(_address.GrumpkinAddress.random(), _accountId.AliasHash.random(), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(31))).toThrow();
    }), it('throw if buffer size is wrong', ()=>{
        expect(()=>_offchainAccountData.OffchainAccountData.fromBuffer((0, _crypto.randomBytes)(_offchainAccountData.OffchainAccountData.SIZE - 1))).toThrow(), expect(()=>_offchainAccountData.OffchainAccountData.fromBuffer((0, _crypto.randomBytes)(_offchainAccountData.OffchainAccountData.SIZE + 1))).toThrow();
    });
});
