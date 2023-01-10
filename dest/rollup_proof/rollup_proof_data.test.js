"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _ = require("."), _proofData = require("../client_proofs/proof_data"), _fixtures = require("./fixtures"), _innerProof = require("./inner_proof"), _rollupProofData = require("./rollup_proof_data");
describe('RollupProofData', ()=>{
    it('can convert a rollup proof object to buffer and back', ()=>{
        let innerProofs = [
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.WITHDRAW),
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_CLAIM),
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEPOSIT),
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.ACCOUNT),
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.SEND),
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_DEPOSIT)
        ], rollupProofData = (0, _fixtures.createRollupProofData)(innerProofs), buffer = rollupProofData.toBuffer(), recoveredRollup = _rollupProofData.RollupProofData.fromBuffer(buffer);
        expect(recoveredRollup).toEqual(rollupProofData);
    }), it('should throw if the number of totalTxFees is wrong', ()=>{
        let assetIds = [
            ...Array(_rollupProofData.RollupProofData.NUMBER_OF_ASSETS)
        ].map(()=>0), totalTxFees = [
            ...Array(_rollupProofData.RollupProofData.NUMBER_OF_ASSETS)
        ].map(()=>BigInt(0));
        totalTxFees.push(BigInt(0));
        let bridgeIds = [
            ...Array(_rollupProofData.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>(0, _crypto.randomBytes)(32)), defiDepositSums = [
            ...Array(_rollupProofData.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>BigInt(0)), defiInteractionNotes = [
            ...Array(_rollupProofData.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>(0, _crypto.randomBytes)(64));
        expect(()=>new _rollupProofData.RollupProofData(70, 2, 150, (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), bridgeIds, defiDepositSums, assetIds, totalTxFees, defiInteractionNotes, (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), 1, [
                (0, _fixtures.randomInnerProofData)()
            ])).toThrow();
    }), it('should throw if the number of bridgeIds is wrong', ()=>{
        let assetIds = [
            ...Array(_rollupProofData.RollupProofData.NUMBER_OF_ASSETS)
        ].map(()=>0), totalTxFees = [
            ...Array(_rollupProofData.RollupProofData.NUMBER_OF_ASSETS)
        ].map(()=>BigInt(0)), bridgeIds = [
            ...Array(_rollupProofData.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>(0, _crypto.randomBytes)(32));
        bridgeIds.push((0, _crypto.randomBytes)(32));
        let defiDepositSums = [
            ...Array(_rollupProofData.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>BigInt(0)), defiInteractionNotes = [
            ...Array(_rollupProofData.RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>(0, _crypto.randomBytes)(64));
        expect(()=>new _rollupProofData.RollupProofData(70, 2, 150, (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), bridgeIds, defiDepositSums, assetIds, totalTxFees, defiInteractionNotes, (0, _crypto.randomBytes)(32), (0, _crypto.randomBytes)(32), 1, [
                (0, _fixtures.randomInnerProofData)()
            ])).toThrow();
    }), it('encode and decode', ()=>{
        let rollupProofData = (0, _fixtures.createRollupProofData)([
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.ACCOUNT),
            (0, _fixtures.randomDepositProofData)(),
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_DEPOSIT),
            (0, _fixtures.randomWithdrawProofData)(),
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.DEFI_CLAIM),
            (0, _fixtures.randomSendProofData)()
        ]), buffer = rollupProofData.toBuffer(), encoded = rollupProofData.encode();
        expect(encoded.length < buffer.length).toBe(!0), expect(_rollupProofData.RollupProofData.decode(encoded)).toEqual(rollupProofData);
    }), it('encode and decode padding proofs', ()=>{
        let rollupProofData = (0, _fixtures.createRollupProofData)([
            (0, _fixtures.randomDepositProofData)(),
            (0, _fixtures.randomInnerProofData)(_proofData.ProofId.ACCOUNT),
            _innerProof.InnerProofData.PADDING,
            _innerProof.InnerProofData.PADDING,
            _innerProof.InnerProofData.PADDING
        ]), buffer = rollupProofData.toBuffer(), encoded = rollupProofData.encode();
        expect(encoded.length < buffer.length).toBe(!0), expect(_rollupProofData.RollupProofData.decode(encoded)).toEqual(rollupProofData);
    }), it('should have correct deposit sum', ()=>{
        let inners = [
            (0, _fixtures.randomDepositProofData)(),
            (0, _fixtures.randomDepositProofData)()
        ], rollupProofData = (0, _fixtures.createRollupProofData)(inners), expected = inners.map((i)=>new _.RollupDepositProofData(i)).reduce((a, i)=>a + i.publicValue, BigInt(0));
        expect(rollupProofData.getTotalDeposited(0)).toEqual(expected);
    }), it('should get tx ids from buffer', ()=>{
        let inners = [
            (0, _fixtures.randomDepositProofData)(),
            (0, _fixtures.randomDepositProofData)()
        ], rollupProofData = (0, _fixtures.createRollupProofData)(inners), expected = rollupProofData.innerProofData.filter((i)=>!i.isPadding()).map((i)=>i.txId), txIds = _rollupProofData.RollupProofData.getTxIdsFromBuffer(rollupProofData.toBuffer());
        expect(txIds).toEqual(expected);
    });
});
