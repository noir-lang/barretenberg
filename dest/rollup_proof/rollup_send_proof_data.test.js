"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _proofData = require("../client_proofs/proof_data"), _fixtures = require("./fixtures"), _rollupSendProofData = require("./rollup_send_proof_data"), _rollupWithdrawProofData = require("./rollup_withdraw_proof_data");
describe('RollupSendProofData', ()=>{
    it('throw if inner proof is not a send proof', ()=>{
        let innerProofData = (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEPOSIT);
        expect(()=>new _rollupSendProofData.RollupSendProofData(innerProofData)).toThrow();
    }), it('encode and decode a proof', ()=>{
        let proof = new _rollupSendProofData.RollupSendProofData((0, _fixtures.randomSendProofData)()), encoded = proof.encode();
        expect(encoded.length).toBe(_rollupSendProofData.RollupSendProofData.ENCODED_LENGTH), expect(_rollupSendProofData.RollupSendProofData.decode(encoded)).toEqual(proof);
    }), it('throw if try to decode the wrong type of proof', ()=>{
        let proof = new _rollupWithdrawProofData.RollupWithdrawProofData((0, _fixtures.randomInnerProofData)(_proofData.ProofId.WITHDRAW)), encoded = proof.encode();
        expect(()=>_rollupSendProofData.RollupSendProofData.decode(encoded)).toThrow();
    });
});
