"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "RollupPaddingProofData", {
    enumerable: !0,
    get: ()=>RollupPaddingProofData
});
const _clientProofs = require("../client_proofs"), _innerProof = require("./inner_proof");
class RollupPaddingProofData {
    get ENCODED_LENGTH() {
        return RollupPaddingProofData.ENCODED_LENGTH;
    }
    static decode(encoded) {
        let proofId = encoded.readUInt8(0);
        if (proofId !== _clientProofs.ProofId.PADDING) throw Error('Not a padding proof.');
        return new RollupPaddingProofData(new _innerProof.InnerProofData(_clientProofs.ProofId.PADDING, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)));
    }
    encode() {
        return Buffer.from([
            _clientProofs.ProofId.PADDING
        ]);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== _clientProofs.ProofId.PADDING) throw Error('Not a padding proof.');
    }
}
RollupPaddingProofData.ENCODED_LENGTH = 1;
