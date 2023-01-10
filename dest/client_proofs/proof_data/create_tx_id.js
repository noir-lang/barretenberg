"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "createTxId", {
    enumerable: !0,
    get: ()=>createTxId
});
const _sha3 = require("sha3"), _proofId = require("./proof_id"), hash = new _sha3.Keccak(256);
function createTxId(rawProofData) {
    let proofId = rawProofData.readUInt32BE(28), txIdData = proofId === _proofId.ProofId.DEFI_DEPOSIT ? Buffer.concat([
        rawProofData.slice(0, 32),
        Buffer.alloc(32),
        rawProofData.slice(64)
    ]) : rawProofData;
    return hash.reset(), hash.update(txIdData).digest();
}
