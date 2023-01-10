"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "AccountProofData", {
    enumerable: !0,
    get: ()=>AccountProofData
});
const _proofData = require("./proof_data"), _proofId = require("./proof_id");
class AccountProofData {
    static fromBuffer(rawProofData) {
        return new AccountProofData(new _proofData.ProofData(rawProofData));
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== _proofId.ProofId.ACCOUNT) throw Error('Not an account proof.');
    }
}
