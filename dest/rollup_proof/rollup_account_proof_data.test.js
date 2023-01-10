"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _proofData = require("../client_proofs/proof_data"), _fixtures = require("./fixtures"), _rollupAccountProofData = require("./rollup_account_proof_data"), _rollupDefiDepositProofData = require("./rollup_defi_deposit_proof_data");
describe('RollupAccountProofData', ()=>{
    it('throw if inner proof is not an account proof', ()=>{
        let innerProofData = (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEPOSIT);
        expect(()=>new _rollupAccountProofData.RollupAccountProofData(innerProofData)).toThrow();
    }), it('encode and decode a proof', ()=>{
        let proof = new _rollupAccountProofData.RollupAccountProofData((0, _fixtures.randomInnerProofData)(_proofData.ProofId.ACCOUNT)), encoded = proof.encode();
        expect(encoded.length).toBe(_rollupAccountProofData.RollupAccountProofData.ENCODED_LENGTH), expect(_rollupAccountProofData.RollupAccountProofData.decode(encoded)).toEqual(proof);
    }), it('throw if try to decode the wrong type of proof', ()=>{
        let proof = new _rollupDefiDepositProofData.RollupDefiDepositProofData((0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_DEPOSIT)), encoded = proof.encode();
        expect(()=>_rollupAccountProofData.RollupAccountProofData.decode(encoded)).toThrow();
    });
});
