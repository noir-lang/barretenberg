"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "JoinSplitProofData", {
    enumerable: !0,
    get: ()=>JoinSplitProofData
});
const _address = require("../../address"), _bigintBuffer = require("../../bigint_buffer"), _proofData = require("./proof_data");
class JoinSplitProofData {
    static fromBuffer(rawProofData) {
        return new JoinSplitProofData(new _proofData.ProofData(rawProofData));
    }
    get txId() {
        return this.proofData.txId;
    }
    get publicAssetId() {
        return this.proofData.publicAssetId.readUInt32BE(28);
    }
    get publicValue() {
        return (0, _bigintBuffer.toBigIntBE)(this.proofData.publicValue);
    }
    get publicOwner() {
        return new _address.EthAddress(this.proofData.publicOwner);
    }
    get txFee() {
        return (0, _bigintBuffer.toBigIntBE)(this.proofData.txFee);
    }
    get txFeeAssetId() {
        return this.proofData.feeAssetId;
    }
    constructor(proofData){
        this.proofData = proofData;
    }
}
