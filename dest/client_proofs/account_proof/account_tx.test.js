"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _accountId = require("../../account_id"), _address = require("../../address"), _merkleTree = require("../../merkle_tree"), _accountTx = require("./account_tx");
describe('account tx', ()=>{
    it('should convert to and from buffer', ()=>{
        let tx = new _accountTx.AccountTx((0, _crypto.randomBytes)(32), _address.GrumpkinAddress.random(), _address.GrumpkinAddress.random(), _address.GrumpkinAddress.random(), _address.GrumpkinAddress.random(), _accountId.AliasHash.random(), !1, !0, 123, new _merkleTree.HashPath([
            ,
            ,
            ,
            , 
        ].fill(0).map(()=>[
                (0, _crypto.randomBytes)(32),
                (0, _crypto.randomBytes)(32)
            ])), _address.GrumpkinAddress.random()), buf = tx.toBuffer();
        expect(_accountTx.AccountTx.fromBuffer(buf)).toEqual(tx);
    });
});
