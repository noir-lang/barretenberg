"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _accountId = require("../../account_id"), _address = require("../../address"), _bigintBuffer = require("../../bigint_buffer"), _bridgeId = require("../../bridge_id"), _merkleTree = require("../../merkle_tree"), _noteAlgorithms = require("../../note_algorithms"), _proofData = require("../proof_data"), _joinSplitTx = require("./join_split_tx"), randomBigInt = ()=>(0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(30)), randomInt = ()=>(0, _crypto.randomBytes)(4).readUInt32BE(), randomHashPath = (size = 4)=>new _merkleTree.HashPath(Array(size).fill(0).map(()=>[
            (0, _crypto.randomBytes)(32),
            (0, _crypto.randomBytes)(32)
        ])), randomTreeNote = ()=>new _noteAlgorithms.TreeNote(_address.GrumpkinAddress.random(), randomBigInt(), randomInt(), !!(randomInt() % 2), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32)), randomClaimNoteTxData = ()=>new _noteAlgorithms.ClaimNoteTxData(randomBigInt(), _bridgeId.BridgeId.random(), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32));
describe('join split tx', ()=>{
    it('convert join split tx to and from buffer', ()=>{
        let tx = new _joinSplitTx.JoinSplitTx(_proofData.ProofId.WITHDRAW, BigInt(123), _address.EthAddress.random(), randomInt(), 2, [
            randomInt(),
            randomInt()
        ], (0, _crypto.randomBytes)(32), [
            randomHashPath(),
            randomHashPath()
        ], [
            randomTreeNote(),
            randomTreeNote()
        ], [
            randomTreeNote(),
            randomTreeNote()
        ], randomClaimNoteTxData(), (0, _crypto.randomBytes)(32), _accountId.AliasHash.random(), !0, randomInt(), randomHashPath(), _address.GrumpkinAddress.random(), (0, _crypto.randomBytes)(32), 3), buf = tx.toBuffer();
        expect(_joinSplitTx.JoinSplitTx.fromBuffer(buf)).toEqual(tx);
    });
});
