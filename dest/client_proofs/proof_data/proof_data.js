"use strict";
var ProofDataFields, ProofDataOffsets;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "ProofData", {
    enumerable: !0,
    get: ()=>ProofData
});
const _createTxId = require("./create_tx_id");
!function(ProofDataFields) {
    ProofDataFields[ProofDataFields.PROOF_ID = 0] = "PROOF_ID", ProofDataFields[ProofDataFields.NOTE_COMMITMENT_1 = 1] = "NOTE_COMMITMENT_1", ProofDataFields[ProofDataFields.NOTE_COMMITMENT_2 = 2] = "NOTE_COMMITMENT_2", ProofDataFields[ProofDataFields.NULLIFIER_1 = 3] = "NULLIFIER_1", ProofDataFields[ProofDataFields.NULLIFIER_2 = 4] = "NULLIFIER_2", ProofDataFields[ProofDataFields.PUBLIC_VALUE = 5] = "PUBLIC_VALUE", ProofDataFields[ProofDataFields.PUBLIC_OWNER = 6] = "PUBLIC_OWNER", ProofDataFields[ProofDataFields.PUBLIC_ASSET_ID = 7] = "PUBLIC_ASSET_ID", ProofDataFields[ProofDataFields.NOTE_TREE_ROOT = 8] = "NOTE_TREE_ROOT", ProofDataFields[ProofDataFields.TX_FEE = 9] = "TX_FEE", ProofDataFields[ProofDataFields.TX_FEE_ASSET_ID = 10] = "TX_FEE_ASSET_ID", ProofDataFields[ProofDataFields.BRIDGE_ID = 11] = "BRIDGE_ID", ProofDataFields[ProofDataFields.DEFI_DEPOSIT_VALUE = 12] = "DEFI_DEPOSIT_VALUE", ProofDataFields[ProofDataFields.DEFI_ROOT = 13] = "DEFI_ROOT", ProofDataFields[ProofDataFields.BACKWARD_LINK = 14] = "BACKWARD_LINK", ProofDataFields[ProofDataFields.ALLOW_CHAIN = 15] = "ALLOW_CHAIN";
}(ProofDataFields || (ProofDataFields = {})), function(ProofDataOffsets) {
    ProofDataOffsets[ProofDataOffsets.PROOF_ID = 32 * ProofDataFields.PROOF_ID + 28] = "PROOF_ID", ProofDataOffsets[ProofDataOffsets.NOTE_COMMITMENT_1 = 32 * ProofDataFields.NOTE_COMMITMENT_1] = "NOTE_COMMITMENT_1", ProofDataOffsets[ProofDataOffsets.NOTE_COMMITMENT_2 = 32 * ProofDataFields.NOTE_COMMITMENT_2] = "NOTE_COMMITMENT_2", ProofDataOffsets[ProofDataOffsets.NULLIFIER_1 = 32 * ProofDataFields.NULLIFIER_1] = "NULLIFIER_1", ProofDataOffsets[ProofDataOffsets.NULLIFIER_2 = 32 * ProofDataFields.NULLIFIER_2] = "NULLIFIER_2", ProofDataOffsets[ProofDataOffsets.PUBLIC_VALUE = 32 * ProofDataFields.PUBLIC_VALUE] = "PUBLIC_VALUE", ProofDataOffsets[ProofDataOffsets.PUBLIC_OWNER = 32 * ProofDataFields.PUBLIC_OWNER] = "PUBLIC_OWNER", ProofDataOffsets[ProofDataOffsets.PUBLIC_ASSET_ID = 32 * ProofDataFields.PUBLIC_ASSET_ID] = "PUBLIC_ASSET_ID", ProofDataOffsets[ProofDataOffsets.NOTE_TREE_ROOT = 32 * ProofDataFields.NOTE_TREE_ROOT] = "NOTE_TREE_ROOT", ProofDataOffsets[ProofDataOffsets.TX_FEE = 32 * ProofDataFields.TX_FEE] = "TX_FEE", ProofDataOffsets[ProofDataOffsets.TX_FEE_ASSET_ID = 32 * ProofDataFields.TX_FEE_ASSET_ID] = "TX_FEE_ASSET_ID", ProofDataOffsets[ProofDataOffsets.BRIDGE_ID = 32 * ProofDataFields.BRIDGE_ID] = "BRIDGE_ID", ProofDataOffsets[ProofDataOffsets.DEFI_DEPOSIT_VALUE = 32 * ProofDataFields.DEFI_DEPOSIT_VALUE] = "DEFI_DEPOSIT_VALUE", ProofDataOffsets[ProofDataOffsets.DEFI_ROOT = 32 * ProofDataFields.DEFI_ROOT] = "DEFI_ROOT", ProofDataOffsets[ProofDataOffsets.BACKWARD_LINK = 32 * ProofDataFields.BACKWARD_LINK] = "BACKWARD_LINK", ProofDataOffsets[ProofDataOffsets.ALLOW_CHAIN = 32 * ProofDataFields.ALLOW_CHAIN] = "ALLOW_CHAIN";
}(ProofDataOffsets || (ProofDataOffsets = {}));
class ProofData {
    static getProofIdFromBuffer(rawProofData) {
        return rawProofData.readUInt32BE(ProofDataOffsets.PROOF_ID);
    }
    get allowChainFromNote1() {
        let allowChain = this.allowChain.readUInt32BE(28);
        return [
            1,
            3
        ].includes(allowChain);
    }
    get allowChainFromNote2() {
        let allowChain = this.allowChain.readUInt32BE(28);
        return [
            2,
            3
        ].includes(allowChain);
    }
    get feeAssetId() {
        return this.txFeeAssetId.readUInt32BE(28);
    }
    constructor(rawProofData){
        this.rawProofData = rawProofData, this.proofId = rawProofData.readUInt32BE(ProofDataOffsets.PROOF_ID), this.noteCommitment1 = rawProofData.slice(ProofDataOffsets.NOTE_COMMITMENT_1, ProofDataOffsets.NOTE_COMMITMENT_1 + 32), this.noteCommitment2 = rawProofData.slice(ProofDataOffsets.NOTE_COMMITMENT_2, ProofDataOffsets.NOTE_COMMITMENT_2 + 32), this.nullifier1 = rawProofData.slice(ProofDataOffsets.NULLIFIER_1, ProofDataOffsets.NULLIFIER_1 + 32), this.nullifier2 = rawProofData.slice(ProofDataOffsets.NULLIFIER_2, ProofDataOffsets.NULLIFIER_2 + 32), this.publicValue = rawProofData.slice(ProofDataOffsets.PUBLIC_VALUE, ProofDataOffsets.PUBLIC_VALUE + 32), this.publicOwner = rawProofData.slice(ProofDataOffsets.PUBLIC_OWNER, ProofDataOffsets.PUBLIC_OWNER + 32), this.publicAssetId = rawProofData.slice(ProofDataOffsets.PUBLIC_ASSET_ID, ProofDataOffsets.PUBLIC_ASSET_ID + 32), this.noteTreeRoot = rawProofData.slice(ProofDataOffsets.NOTE_TREE_ROOT, ProofDataOffsets.NOTE_TREE_ROOT + 32), this.txFee = rawProofData.slice(ProofDataOffsets.TX_FEE, ProofDataOffsets.TX_FEE + 32), this.txFeeAssetId = rawProofData.slice(ProofDataOffsets.TX_FEE_ASSET_ID, ProofDataOffsets.TX_FEE_ASSET_ID + 32), this.bridgeId = rawProofData.slice(ProofDataOffsets.BRIDGE_ID, ProofDataOffsets.BRIDGE_ID + 32), this.defiDepositValue = rawProofData.slice(ProofDataOffsets.DEFI_DEPOSIT_VALUE, ProofDataOffsets.DEFI_DEPOSIT_VALUE + 32), this.defiRoot = rawProofData.slice(ProofDataOffsets.DEFI_ROOT, ProofDataOffsets.DEFI_ROOT + 32), this.backwardLink = rawProofData.slice(ProofDataOffsets.BACKWARD_LINK, ProofDataOffsets.BACKWARD_LINK + 32), this.allowChain = rawProofData.slice(ProofDataOffsets.ALLOW_CHAIN, ProofDataOffsets.ALLOW_CHAIN + 32), this.txId = (0, _createTxId.createTxId)(rawProofData.slice(0, 32 * ProofData.NUM_PUBLISHED_PUBLIC_INPUTS));
    }
}
ProofData.NUM_PUBLIC_INPUTS = 17, ProofData.NUM_PUBLISHED_PUBLIC_INPUTS = 8;
