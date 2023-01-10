"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "DefiClaimProofData", {
    enumerable: !0,
    get: ()=>DefiClaimProofData
});
const _bigintBuffer = require("../../bigint_buffer"), _bridgeId = require("../../bridge_id"), _proofData = require("./proof_data"), _proofId = require("./proof_id");
class DefiClaimProofData {
    static fromBuffer(rawProofData) {
        return new DefiClaimProofData(new _proofData.ProofData(rawProofData));
    }
    get txFee() {
        return (0, _bigintBuffer.toBigIntBE)(this.proofData.txFee);
    }
    get txFeeAssetId() {
        return this.proofData.feeAssetId;
    }
    get bridgeId() {
        return _bridgeId.BridgeId.fromBuffer(this.proofData.bridgeId);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== _proofId.ProofId.DEFI_CLAIM) throw Error('Not a defi claim proof.');
    }
}
