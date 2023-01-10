"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _address = require("../address"), _bigintBuffer = require("../bigint_buffer"), _proofData = require("../client_proofs/proof_data"), _serialize = require("../serialize"), _fixtures = require("./fixtures"), _innerProof = require("./inner_proof"), _rollupDefiDepositProofData = require("./rollup_defi_deposit_proof_data"), _rollupDepositProofData = require("./rollup_deposit_proof_data");
describe('RollupDepositProofData', ()=>{
    it('can get typed data from proof data', ()=>{
        let publicValue = BigInt(123), publicOwner = _address.EthAddress.random(), innerProofData = new _innerProof.InnerProofData(_proofData.ProofId.DEPOSIT, (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _bigintBuffer.toBufferBE)(publicValue, 32), publicOwner.toBuffer32(), (0, _serialize.numToUInt32BE)(123, 32)), jsProof = new _rollupDepositProofData.RollupDepositProofData(innerProofData);
        expect(jsProof.assetId).toBe(123), expect(jsProof.publicValue).toBe(publicValue), expect(jsProof.publicOwner).toEqual(publicOwner);
    }), it('throw if inner proof is not a deposit proof', ()=>{
        let innerProofData = (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_DEPOSIT);
        expect(()=>new _rollupDepositProofData.RollupDepositProofData(innerProofData)).toThrow();
    }), it('encode and decode a proof', ()=>{
        let proof = new _rollupDepositProofData.RollupDepositProofData((0, _fixtures.randomDepositProofData)()), encoded = proof.encode();
        expect(encoded.length).toBe(_rollupDepositProofData.RollupDepositProofData.ENCODED_LENGTH), expect(_rollupDepositProofData.RollupDepositProofData.decode(encoded)).toEqual(proof);
    }), it('throw if try to decode the wrong type of proof', ()=>{
        let proof = new _rollupDefiDepositProofData.RollupDefiDepositProofData((0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_DEPOSIT)), encoded = proof.encode();
        expect(()=>_rollupDepositProofData.RollupDepositProofData.decode(encoded)).toThrow();
    });
});
