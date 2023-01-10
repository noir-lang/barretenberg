import { randomBytes } from 'crypto';
import { RollupDepositProofData } from '.';
import { ProofId } from '../client_proofs/proof_data';
import { createRollupProofData, randomDepositProofData, randomInnerProofData, randomSendProofData, randomWithdrawProofData } from './fixtures';
import { InnerProofData } from './inner_proof';
import { RollupProofData } from './rollup_proof_data';
describe('RollupProofData', ()=>{
    it('can convert a rollup proof object to buffer and back', ()=>{
        let innerProofs = [
            randomInnerProofData(ProofId.WITHDRAW),
            randomInnerProofData(ProofId.DEFI_CLAIM),
            randomInnerProofData(ProofId.DEPOSIT),
            randomInnerProofData(ProofId.ACCOUNT),
            randomInnerProofData(ProofId.SEND),
            randomInnerProofData(ProofId.DEFI_DEPOSIT)
        ], rollupProofData = createRollupProofData(innerProofs), buffer = rollupProofData.toBuffer(), recoveredRollup = RollupProofData.fromBuffer(buffer);
        expect(recoveredRollup).toEqual(rollupProofData);
    }), it('should throw if the number of totalTxFees is wrong', ()=>{
        let assetIds = [
            ...Array(RollupProofData.NUMBER_OF_ASSETS)
        ].map(()=>0), totalTxFees = [
            ...Array(RollupProofData.NUMBER_OF_ASSETS)
        ].map(()=>BigInt(0));
        totalTxFees.push(BigInt(0));
        let bridgeIds = [
            ...Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>randomBytes(32)), defiDepositSums = [
            ...Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>BigInt(0)), defiInteractionNotes = [
            ...Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>randomBytes(64));
        expect(()=>new RollupProofData(70, 2, 150, randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), bridgeIds, defiDepositSums, assetIds, totalTxFees, defiInteractionNotes, randomBytes(32), randomBytes(32), 1, [
                randomInnerProofData()
            ])).toThrow();
    }), it('should throw if the number of bridgeIds is wrong', ()=>{
        let assetIds = [
            ...Array(RollupProofData.NUMBER_OF_ASSETS)
        ].map(()=>0), totalTxFees = [
            ...Array(RollupProofData.NUMBER_OF_ASSETS)
        ].map(()=>BigInt(0)), bridgeIds = [
            ...Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>randomBytes(32));
        bridgeIds.push(randomBytes(32));
        let defiDepositSums = [
            ...Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>BigInt(0)), defiInteractionNotes = [
            ...Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK)
        ].map(()=>randomBytes(64));
        expect(()=>new RollupProofData(70, 2, 150, randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), randomBytes(32), bridgeIds, defiDepositSums, assetIds, totalTxFees, defiInteractionNotes, randomBytes(32), randomBytes(32), 1, [
                randomInnerProofData()
            ])).toThrow();
    }), it('encode and decode', ()=>{
        let rollupProofData = createRollupProofData([
            randomInnerProofData(ProofId.ACCOUNT),
            randomDepositProofData(),
            randomInnerProofData(ProofId.DEFI_DEPOSIT),
            randomWithdrawProofData(),
            randomInnerProofData(ProofId.DEFI_CLAIM),
            randomSendProofData()
        ]), buffer = rollupProofData.toBuffer(), encoded = rollupProofData.encode();
        expect(encoded.length < buffer.length).toBe(!0), expect(RollupProofData.decode(encoded)).toEqual(rollupProofData);
    }), it('encode and decode padding proofs', ()=>{
        let rollupProofData = createRollupProofData([
            randomDepositProofData(),
            randomInnerProofData(ProofId.ACCOUNT),
            InnerProofData.PADDING,
            InnerProofData.PADDING,
            InnerProofData.PADDING
        ]), buffer = rollupProofData.toBuffer(), encoded = rollupProofData.encode();
        expect(encoded.length < buffer.length).toBe(!0), expect(RollupProofData.decode(encoded)).toEqual(rollupProofData);
    }), it('should have correct deposit sum', ()=>{
        let inners = [
            randomDepositProofData(),
            randomDepositProofData()
        ], rollupProofData = createRollupProofData(inners), expected = inners.map((i)=>new RollupDepositProofData(i)).reduce((a, i)=>a + i.publicValue, BigInt(0));
        expect(rollupProofData.getTotalDeposited(0)).toEqual(expected);
    }), it('should get tx ids from buffer', ()=>{
        let inners = [
            randomDepositProofData(),
            randomDepositProofData()
        ], rollupProofData = createRollupProofData(inners), expected = rollupProofData.innerProofData.filter((i)=>!i.isPadding()).map((i)=>i.txId), txIds = RollupProofData.getTxIdsFromBuffer(rollupProofData.toBuffer());
        expect(txIds).toEqual(expected);
    });
});
