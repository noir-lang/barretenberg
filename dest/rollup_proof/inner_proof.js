"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "InnerProofData", {
    enumerable: !0,
    get: ()=>InnerProofData
});
const _clientProofs = require("../client_proofs"), _serialize = require("../serialize");
class InnerProofData {
    get txId() {
        return this.txId_ || (this.txId_ = (0, _clientProofs.createTxId)(this.toBuffer())), this.txId_;
    }
    getDepositSigningData() {
        return this.toBuffer();
    }
    toBuffer() {
        return Buffer.concat([
            (0, _serialize.numToUInt32BE)(this.proofId, 32),
            this.noteCommitment1,
            this.noteCommitment2,
            this.nullifier1,
            this.nullifier2,
            this.publicValue,
            this.publicOwner,
            this.publicAssetId
        ]);
    }
    isPadding() {
        return this.proofId === _clientProofs.ProofId.PADDING;
    }
    static fromBuffer(innerPublicInputs) {
        let dataStart = 0, proofId = innerPublicInputs.readUInt32BE(dataStart + 28);
        dataStart += 32;
        let noteCommitment1 = innerPublicInputs.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let noteCommitment2 = innerPublicInputs.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let nullifier1 = innerPublicInputs.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let nullifier2 = innerPublicInputs.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let publicValue = innerPublicInputs.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let publicOwner = innerPublicInputs.slice(dataStart, dataStart + 32);
        dataStart += 32;
        let publicAssetId = innerPublicInputs.slice(dataStart, dataStart + 32);
        return dataStart += 32, new InnerProofData(proofId, noteCommitment1, noteCommitment2, nullifier1, nullifier2, publicValue, publicOwner, publicAssetId);
    }
    constructor(proofId, noteCommitment1, noteCommitment2, nullifier1, nullifier2, publicValue, publicOwner, publicAssetId){
        this.proofId = proofId, this.noteCommitment1 = noteCommitment1, this.noteCommitment2 = noteCommitment2, this.nullifier1 = nullifier1, this.nullifier2 = nullifier2, this.publicValue = publicValue, this.publicOwner = publicOwner, this.publicAssetId = publicAssetId;
    }
}
InnerProofData.NUM_PUBLIC_INPUTS = 8, InnerProofData.LENGTH = 32 * InnerProofData.NUM_PUBLIC_INPUTS, InnerProofData.PADDING = InnerProofData.fromBuffer(Buffer.alloc(InnerProofData.LENGTH));
