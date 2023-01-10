import { createHash } from 'crypto';
import { createTxId, ProofId } from '../client_proofs';
import { numToUInt32BE } from '../serialize';
import { decodeInnerProof } from './decode_inner_proof';
import { encodeInnerProof } from './encode_inner_proof';
import { InnerProofData } from './inner_proof';
import { RollupDepositProofData, RollupWithdrawProofData } from '.';
import { toBigIntBE, toBufferBE } from '../bigint_buffer';
import { BridgeId } from '../bridge_id';
export var RollupProofDataFields;
!function(RollupProofDataFields) {
    RollupProofDataFields[RollupProofDataFields.ROLLUP_ID = 0] = "ROLLUP_ID", RollupProofDataFields[RollupProofDataFields.ROLLUP_SIZE = 1] = "ROLLUP_SIZE", RollupProofDataFields[RollupProofDataFields.DATA_START_INDEX = 2] = "DATA_START_INDEX", RollupProofDataFields[RollupProofDataFields.OLD_DATA_ROOT = 3] = "OLD_DATA_ROOT", RollupProofDataFields[RollupProofDataFields.NEW_DATA_ROOT = 4] = "NEW_DATA_ROOT", RollupProofDataFields[RollupProofDataFields.OLD_NULL_ROOT = 5] = "OLD_NULL_ROOT", RollupProofDataFields[RollupProofDataFields.NEW_NULL_ROOT = 6] = "NEW_NULL_ROOT", RollupProofDataFields[RollupProofDataFields.OLD_ROOT_ROOT = 7] = "OLD_ROOT_ROOT", RollupProofDataFields[RollupProofDataFields.NEW_ROOT_ROOT = 8] = "NEW_ROOT_ROOT", RollupProofDataFields[RollupProofDataFields.OLD_DEFI_ROOT = 9] = "OLD_DEFI_ROOT", RollupProofDataFields[RollupProofDataFields.NEW_DEFI_ROOT = 10] = "NEW_DEFI_ROOT";
}(RollupProofDataFields || (RollupProofDataFields = {}));
export var RollupProofDataOffsets;
!function(RollupProofDataOffsets) {
    RollupProofDataOffsets[RollupProofDataOffsets.ROLLUP_ID = 32 * RollupProofDataFields.ROLLUP_ID + 28] = "ROLLUP_ID", RollupProofDataOffsets[RollupProofDataOffsets.ROLLUP_SIZE = 32 * RollupProofDataFields.ROLLUP_SIZE + 28] = "ROLLUP_SIZE", RollupProofDataOffsets[RollupProofDataOffsets.DATA_START_INDEX = 32 * RollupProofDataFields.DATA_START_INDEX + 28] = "DATA_START_INDEX", RollupProofDataOffsets[RollupProofDataOffsets.OLD_DATA_ROOT = 32 * RollupProofDataFields.OLD_DATA_ROOT] = "OLD_DATA_ROOT", RollupProofDataOffsets[RollupProofDataOffsets.NEW_DATA_ROOT = 32 * RollupProofDataFields.NEW_DATA_ROOT] = "NEW_DATA_ROOT", RollupProofDataOffsets[RollupProofDataOffsets.OLD_NULL_ROOT = 32 * RollupProofDataFields.OLD_NULL_ROOT] = "OLD_NULL_ROOT", RollupProofDataOffsets[RollupProofDataOffsets.NEW_NULL_ROOT = 32 * RollupProofDataFields.NEW_NULL_ROOT] = "NEW_NULL_ROOT", RollupProofDataOffsets[RollupProofDataOffsets.OLD_ROOT_ROOT = 32 * RollupProofDataFields.OLD_ROOT_ROOT] = "OLD_ROOT_ROOT", RollupProofDataOffsets[RollupProofDataOffsets.NEW_ROOT_ROOT = 32 * RollupProofDataFields.NEW_ROOT_ROOT] = "NEW_ROOT_ROOT", RollupProofDataOffsets[RollupProofDataOffsets.OLD_DEFI_ROOT = 32 * RollupProofDataFields.OLD_DEFI_ROOT] = "OLD_DEFI_ROOT", RollupProofDataOffsets[RollupProofDataOffsets.NEW_DEFI_ROOT = 32 * RollupProofDataFields.NEW_DEFI_ROOT] = "NEW_DEFI_ROOT";
}(RollupProofDataOffsets || (RollupProofDataOffsets = {}));
let parseHeaderInputs = (proofData)=>{
    let rollupId = RollupProofData.getRollupIdFromBuffer(proofData), rollupSize = proofData.readUInt32BE(RollupProofDataOffsets.ROLLUP_SIZE), dataStartIndex = proofData.readUInt32BE(RollupProofDataOffsets.DATA_START_INDEX), oldDataRoot = proofData.slice(RollupProofDataOffsets.OLD_DATA_ROOT, RollupProofDataOffsets.OLD_DATA_ROOT + 32), newDataRoot = proofData.slice(RollupProofDataOffsets.NEW_DATA_ROOT, RollupProofDataOffsets.NEW_DATA_ROOT + 32), oldNullRoot = proofData.slice(RollupProofDataOffsets.OLD_NULL_ROOT, RollupProofDataOffsets.OLD_NULL_ROOT + 32), newNullRoot = proofData.slice(RollupProofDataOffsets.NEW_NULL_ROOT, RollupProofDataOffsets.NEW_NULL_ROOT + 32), oldDataRootsRoot = proofData.slice(RollupProofDataOffsets.OLD_ROOT_ROOT, RollupProofDataOffsets.OLD_ROOT_ROOT + 32), newDataRootsRoot = proofData.slice(RollupProofDataOffsets.NEW_ROOT_ROOT, RollupProofDataOffsets.NEW_ROOT_ROOT + 32), oldDefiRoot = proofData.slice(RollupProofDataOffsets.OLD_DEFI_ROOT, RollupProofDataOffsets.OLD_DEFI_ROOT + 32), newDefiRoot = proofData.slice(RollupProofDataOffsets.NEW_DEFI_ROOT, RollupProofDataOffsets.NEW_DEFI_ROOT + 32), startIndex = 352, bridgeIds = [];
    for(let i = 0; i < RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK; ++i)bridgeIds.push(proofData.slice(startIndex, startIndex + 32)), startIndex += 32;
    let defiDepositSums = [];
    for(let i1 = 0; i1 < RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK; ++i1)defiDepositSums.push(toBigIntBE(proofData.slice(startIndex, startIndex + 32))), startIndex += 32;
    let assetIds = [];
    for(let i2 = 0; i2 < RollupProofData.NUMBER_OF_ASSETS; ++i2)assetIds.push(proofData.readUInt32BE(startIndex + 28)), startIndex += 32;
    let totalTxFees = [];
    for(let i3 = 0; i3 < RollupProofData.NUMBER_OF_ASSETS; ++i3)totalTxFees.push(toBigIntBE(proofData.slice(startIndex, startIndex + 32))), startIndex += 32;
    let defiInteractionNotes = [];
    for(let i4 = 0; i4 < RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK; ++i4)defiInteractionNotes.push(proofData.slice(startIndex, startIndex + 32)), startIndex += 32;
    let prevDefiInteractionHash = proofData.slice(startIndex, startIndex + 32);
    startIndex += 32;
    let rollupBeneficiary = proofData.slice(startIndex, startIndex + 32);
    startIndex += 32;
    let numRollupTxs = proofData.readUInt32BE(startIndex + 28);
    return startIndex += 32, {
        rollupId,
        rollupSize,
        dataStartIndex,
        oldDataRoot,
        newDataRoot,
        oldNullRoot,
        newNullRoot,
        oldDataRootsRoot,
        newDataRootsRoot,
        oldDefiRoot,
        newDefiRoot,
        bridgeIds,
        defiDepositSums,
        assetIds,
        totalTxFees,
        defiInteractionNotes,
        prevDefiInteractionHash,
        rollupBeneficiary,
        numRollupTxs
    };
};
export class RollupProofData {
    get rollupHash() {
        if (!this.rollupHash_) {
            let allTxIds = this.innerProofData.map((innerProof)=>innerProof.txId);
            this.rollupHash_ = createHash('sha256').update(Buffer.concat(allTxIds)).digest();
        }
        return this.rollupHash_;
    }
    toBuffer() {
        return Buffer.concat([
            numToUInt32BE(this.rollupId, 32),
            numToUInt32BE(this.rollupSize, 32),
            numToUInt32BE(this.dataStartIndex, 32),
            this.oldDataRoot,
            this.newDataRoot,
            this.oldNullRoot,
            this.newNullRoot,
            this.oldDataRootsRoot,
            this.newDataRootsRoot,
            this.oldDefiRoot,
            this.newDefiRoot,
            ...this.bridgeIds,
            ...this.defiDepositSums.map((v)=>toBufferBE(v, 32)),
            ...this.assetIds.map((a)=>numToUInt32BE(a, 32)),
            ...this.totalTxFees.map((a)=>toBufferBE(a, 32)),
            ...this.defiInteractionNotes,
            this.prevDefiInteractionHash,
            this.rollupBeneficiary,
            numToUInt32BE(this.numRollupTxs, 32),
            ...this.innerProofData.map((p)=>p.toBuffer())
        ]);
    }
    getTotalDeposited(assetId) {
        return this.innerProofData.filter((p)=>p.proofId === ProofId.DEPOSIT).map((p)=>new RollupDepositProofData(p)).filter((p)=>p.assetId == assetId).reduce((a, p)=>a + p.publicValue, BigInt(0));
    }
    getTotalWithdrawn(assetId) {
        return this.innerProofData.filter((p)=>p.proofId === ProofId.WITHDRAW).map((p)=>new RollupWithdrawProofData(p)).filter((p)=>p.assetId == assetId).reduce((a, p)=>a + p.publicValue, BigInt(0));
    }
    getTotalDefiDeposit(assetId) {
        return this.bridgeIds.map((bridgeId, i)=>BridgeId.fromBuffer(bridgeId).inputAssetIdA === assetId || BridgeId.fromBuffer(bridgeId).inputAssetIdB === assetId ? this.defiDepositSums[i] : BigInt(0)).reduce((acc, val)=>acc + val, BigInt(0));
    }
    getTotalFees(assetId) {
        let index = this.assetIds.indexOf(assetId);
        return index < 0 ? BigInt(0) : this.totalTxFees[index];
    }
    encode() {
        let lastNonEmptyIndex = 0;
        this.innerProofData.forEach((p, i)=>{
            p.proofId !== ProofId.PADDING && (lastNonEmptyIndex = i);
        });
        let numRealTxns = lastNonEmptyIndex + 1, encodedInnerProof = this.innerProofData.filter((p, i)=>i < numRealTxns).map((p)=>encodeInnerProof(p));
        return Buffer.concat([
            numToUInt32BE(this.rollupId, 32),
            numToUInt32BE(this.rollupSize, 32),
            numToUInt32BE(this.dataStartIndex, 32),
            this.oldDataRoot,
            this.newDataRoot,
            this.oldNullRoot,
            this.newNullRoot,
            this.oldDataRootsRoot,
            this.newDataRootsRoot,
            this.oldDefiRoot,
            this.newDefiRoot,
            ...this.bridgeIds,
            ...this.defiDepositSums.map((v)=>toBufferBE(v, 32)),
            ...this.assetIds.map((a)=>numToUInt32BE(a, 32)),
            ...this.totalTxFees.map((a)=>toBufferBE(a, 32)),
            ...this.defiInteractionNotes,
            this.prevDefiInteractionHash,
            this.rollupBeneficiary,
            numToUInt32BE(this.numRollupTxs, 32),
            numToUInt32BE(numRealTxns),
            numToUInt32BE(Buffer.concat(encodedInnerProof).length),
            ...encodedInnerProof
        ]);
    }
    static getRollupIdFromBuffer(proofData) {
        return proofData.readUInt32BE(RollupProofDataOffsets.ROLLUP_ID);
    }
    static getRollupSizeFromBuffer(proofData) {
        return proofData.readUInt32BE(RollupProofDataOffsets.ROLLUP_SIZE);
    }
    static getTxIdsFromBuffer(proofData) {
        let rollupSize = RollupProofData.getRollupSizeFromBuffer(proofData), startIndex = RollupProofData.LENGTH_ROLLUP_HEADER_INPUTS;
        return Array.from({
            length: rollupSize
        }).map((_, i)=>{
            let innerProofStart = startIndex + i * InnerProofData.LENGTH;
            return createTxId(proofData.slice(innerProofStart, innerProofStart + InnerProofData.LENGTH));
        }).filter((id)=>!id.equals(InnerProofData.PADDING.txId));
    }
    getNonPaddingProofs() {
        return this.innerProofData.filter((proofData)=>!proofData.isPadding());
    }
    getNonPaddingTxIds() {
        return this.getNonPaddingProofs().map((proof)=>proof.txId);
    }
    getNonPaddingProofIds() {
        return this.getNonPaddingProofs().map((proof)=>proof.proofId);
    }
    static fromBuffer(proofData) {
        let { rollupId , rollupSize , dataStartIndex , oldDataRoot , newDataRoot , oldNullRoot , newNullRoot , oldDataRootsRoot , newDataRootsRoot , oldDefiRoot , newDefiRoot , bridgeIds , defiDepositSums , assetIds , totalTxFees , defiInteractionNotes , prevDefiInteractionHash , rollupBeneficiary , numRollupTxs  } = parseHeaderInputs(proofData);
        if (!rollupSize) throw Error('Empty rollup.');
        let startIndex = RollupProofData.LENGTH_ROLLUP_HEADER_INPUTS, innerProofData = [];
        for(let i = 0; i < rollupSize; ++i){
            let innerData = proofData.slice(startIndex, startIndex + InnerProofData.LENGTH);
            innerProofData[i] = InnerProofData.fromBuffer(innerData), startIndex += InnerProofData.LENGTH;
        }
        return new RollupProofData(rollupId, rollupSize, dataStartIndex, oldDataRoot, newDataRoot, oldNullRoot, newNullRoot, oldDataRootsRoot, newDataRootsRoot, oldDefiRoot, newDefiRoot, bridgeIds, defiDepositSums, assetIds, totalTxFees, defiInteractionNotes, prevDefiInteractionHash, rollupBeneficiary, numRollupTxs, innerProofData);
    }
    static randomData(rollupId, numTxs, dataStartIndex = 0, innerProofData, bridgeIds = []) {
        let ipd = void 0 === innerProofData ? Array(numTxs).fill(0).map(()=>InnerProofData.fromBuffer(Buffer.alloc(InnerProofData.LENGTH))) : innerProofData;
        return new RollupProofData(rollupId, numTxs, dataStartIndex, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), bridgeIds.map((b)=>b.toBuffer()).concat(Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK - bridgeIds.length).fill(0).map(()=>Buffer.alloc(32))), Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK).fill(BigInt(0)), Array(RollupProofData.NUMBER_OF_ASSETS).fill(0), Array(RollupProofData.NUMBER_OF_ASSETS).fill(BigInt(0)), Array(RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK).fill(0).map(()=>Buffer.alloc(32)), Buffer.alloc(32), Buffer.alloc(32), ipd.length, ipd);
    }
    static decode(encoded) {
        let { rollupId , rollupSize , dataStartIndex , oldDataRoot , newDataRoot , oldNullRoot , newNullRoot , oldDataRootsRoot , newDataRootsRoot , oldDefiRoot , newDefiRoot , bridgeIds , defiDepositSums , assetIds , totalTxFees , defiInteractionNotes , prevDefiInteractionHash , rollupBeneficiary , numRollupTxs  } = parseHeaderInputs(encoded);
        if (!rollupSize) throw Error('Empty rollup.');
        let startIndex = RollupProofData.LENGTH_ROLLUP_HEADER_INPUTS;
        startIndex += 4;
        let innerProofDataLength = encoded.readUInt32BE(startIndex);
        startIndex += 4;
        let innerProofData = [];
        for(; innerProofDataLength > 0;){
            let innerProof = decodeInnerProof(encoded.slice(startIndex));
            innerProofData.push(innerProof.proofData), startIndex += innerProof.ENCODED_LENGTH, innerProofDataLength -= innerProof.ENCODED_LENGTH;
        }
        for(let i = innerProofData.length; i < rollupSize; ++i)innerProofData.push(InnerProofData.PADDING);
        return new RollupProofData(rollupId, rollupSize, dataStartIndex, oldDataRoot, newDataRoot, oldNullRoot, newNullRoot, oldDataRootsRoot, newDataRootsRoot, oldDefiRoot, newDefiRoot, bridgeIds, defiDepositSums, assetIds, totalTxFees, defiInteractionNotes, prevDefiInteractionHash, rollupBeneficiary, numRollupTxs, innerProofData);
    }
    constructor(rollupId, rollupSize, dataStartIndex, oldDataRoot, newDataRoot, oldNullRoot, newNullRoot, oldDataRootsRoot, newDataRootsRoot, oldDefiRoot, newDefiRoot, bridgeIds, defiDepositSums, assetIds, totalTxFees, defiInteractionNotes, prevDefiInteractionHash, rollupBeneficiary, numRollupTxs, innerProofData){
        if (this.rollupId = rollupId, this.rollupSize = rollupSize, this.dataStartIndex = dataStartIndex, this.oldDataRoot = oldDataRoot, this.newDataRoot = newDataRoot, this.oldNullRoot = oldNullRoot, this.newNullRoot = newNullRoot, this.oldDataRootsRoot = oldDataRootsRoot, this.newDataRootsRoot = newDataRootsRoot, this.oldDefiRoot = oldDefiRoot, this.newDefiRoot = newDefiRoot, this.bridgeIds = bridgeIds, this.defiDepositSums = defiDepositSums, this.assetIds = assetIds, this.totalTxFees = totalTxFees, this.defiInteractionNotes = defiInteractionNotes, this.prevDefiInteractionHash = prevDefiInteractionHash, this.rollupBeneficiary = rollupBeneficiary, this.numRollupTxs = numRollupTxs, this.innerProofData = innerProofData, bridgeIds.length !== RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK) throw Error(`Expect bridgeIds to be an array of size ${RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK}.`);
        if (defiDepositSums.length !== RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK) throw Error(`Expect defiDepositSums to be an array of size ${RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK}.`);
        if (totalTxFees.length !== RollupProofData.NUMBER_OF_ASSETS) throw Error(`Expect totalTxFees to be an array of size ${RollupProofData.NUMBER_OF_ASSETS}.`);
        if (defiInteractionNotes.length !== RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK) throw Error(`Expect defiInteractionNotes to be an array of size ${RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK}.`);
    }
}
RollupProofData.NUMBER_OF_ASSETS = 16, RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK = 32, RollupProofData.NUM_ROLLUP_HEADER_INPUTS = 14 + 2 * RollupProofData.NUMBER_OF_ASSETS + 3 * RollupProofData.NUM_BRIDGE_CALLS_PER_BLOCK, RollupProofData.LENGTH_ROLLUP_HEADER_INPUTS = 32 * RollupProofData.NUM_ROLLUP_HEADER_INPUTS;
