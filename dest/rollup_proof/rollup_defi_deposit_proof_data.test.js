"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _proofData = require("../client_proofs/proof_data"), _fixtures = require("./fixtures"), _rollupDefiClaimProofData = require("./rollup_defi_claim_proof_data"), _rollupDefiDepositProofData = require("./rollup_defi_deposit_proof_data");
describe('RollupDefiDepositProofData', ()=>{
    it('throw if inner proof is not a defi deposit proof', ()=>{
        let innerProofData = (0, _fixtures.randomInnerProofData)(_proofData.ProofId.ACCOUNT);
        expect(()=>new _rollupDefiDepositProofData.RollupDefiDepositProofData(innerProofData)).toThrow();
    }), it('encode and decode a proof', ()=>{
        let proof = new _rollupDefiDepositProofData.RollupDefiDepositProofData((0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_DEPOSIT)), encoded = proof.encode();
        expect(encoded.length).toBe(_rollupDefiDepositProofData.RollupDefiDepositProofData.ENCODED_LENGTH), expect(_rollupDefiDepositProofData.RollupDefiDepositProofData.decode(encoded)).toEqual(proof);
    }), it('throw if try to decode the wrong type of proof', ()=>{
        let proof = new _rollupDefiClaimProofData.RollupDefiClaimProofData((0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_CLAIM)), encoded = proof.encode();
        expect(()=>_rollupDefiDepositProofData.RollupDefiDepositProofData.decode(encoded)).toThrow();
    });
});
