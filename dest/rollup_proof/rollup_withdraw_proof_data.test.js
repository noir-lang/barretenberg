"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _address = require("../address"), _bigintBuffer = require("../bigint_buffer"), _proofData = require("../client_proofs/proof_data"), _serialize = require("../serialize"), _fixtures = require("./fixtures"), _innerProof = require("./inner_proof"), _rollupSendProofData = require("./rollup_send_proof_data"), _rollupWithdrawProofData = require("./rollup_withdraw_proof_data");
describe('RollupWithdrawProofData', ()=>{
    it('can get typed data from proof data', ()=>{
        let publicValue = BigInt(123), publicOwner = _address.EthAddress.random(), innerProofData = new _innerProof.InnerProofData(_proofData.ProofId.WITHDRAW, (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _bigintBuffer.toBufferBE)(publicValue, 32), publicOwner.toBuffer32(), (0, _serialize.numToUInt32BE)(123, 32)), jsProof = new _rollupWithdrawProofData.RollupWithdrawProofData(innerProofData);
        expect(jsProof.assetId).toBe(123), expect(jsProof.publicValue).toBe(publicValue), expect(jsProof.publicOwner).toEqual(publicOwner);
    }), it('throw if inner proof is not a withdraw proof', ()=>{
        let innerProofData = (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEPOSIT);
        expect(()=>new _rollupWithdrawProofData.RollupWithdrawProofData(innerProofData)).toThrow();
    }), it('encode and decode a proof', ()=>{
        let proof = new _rollupWithdrawProofData.RollupWithdrawProofData((0, _fixtures.randomWithdrawProofData)()), encoded = proof.encode();
        expect(encoded.length).toBe(_rollupWithdrawProofData.RollupWithdrawProofData.ENCODED_LENGTH), expect(_rollupWithdrawProofData.RollupWithdrawProofData.decode(encoded)).toEqual(proof);
    }), it('throw if try to decode the wrong type of proof', ()=>{
        let proof = new _rollupSendProofData.RollupSendProofData((0, _fixtures.randomInnerProofData)(_proofData.ProofId.SEND)), encoded = proof.encode();
        expect(()=>_rollupWithdrawProofData.RollupWithdrawProofData.decode(encoded)).toThrow();
    });
});
