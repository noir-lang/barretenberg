"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "DefiDepositProofData", {
    enumerable: !0,
    get: ()=>DefiDepositProofData
});
const _bigintBuffer = require("../../bigint_buffer"), _bridgeId = require("../../bridge_id"), _proofData = require("./proof_data"), _proofId = require("./proof_id");
class DefiDepositProofData {
    static fromBuffer(rawProofData) {
        return new DefiDepositProofData(new _proofData.ProofData(rawProofData));
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
    get defiDepositValue() {
        return (0, _bigintBuffer.toBigIntBE)(this.proofData.defiDepositValue);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== _proofId.ProofId.DEFI_DEPOSIT) throw Error('Not a defi deposit proof.');
    }
}
