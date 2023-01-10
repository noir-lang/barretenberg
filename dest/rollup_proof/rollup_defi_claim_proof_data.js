"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "RollupDefiClaimProofData", {
    enumerable: !0,
    get: ()=>RollupDefiClaimProofData
});
const _bridgeId = require("../bridge_id"), _clientProofs = require("../client_proofs"), _innerProof = require("./inner_proof");
class RollupDefiClaimProofData {
    get ENCODED_LENGTH() {
        return RollupDefiClaimProofData.ENCODED_LENGTH;
    }
    get bridgeId() {
        return _bridgeId.BridgeId.fromBuffer(this.proofData.publicAssetId);
    }
    static decode(encoded) {
        let proofId = encoded.readUInt8(0);
        if (proofId !== _clientProofs.ProofId.DEFI_CLAIM) throw Error('Not a defi claim proof.');
        let offset = 1, noteCommitment1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let noteCommitment2 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier2 = encoded.slice(offset, offset + 32);
        return new RollupDefiClaimProofData(new _innerProof.InnerProofData(_clientProofs.ProofId.DEFI_CLAIM, noteCommitment1, noteCommitment2, nullifier1, nullifier2, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)));
    }
    encode() {
        let { noteCommitment1 , noteCommitment2 , nullifier1 , nullifier2  } = this.proofData;
        return Buffer.concat([
            Buffer.from([
                _clientProofs.ProofId.DEFI_CLAIM
            ]),
            noteCommitment1,
            noteCommitment2,
            nullifier1,
            nullifier2
        ]);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== _clientProofs.ProofId.DEFI_CLAIM) throw Error('Not a defi claim proof.');
    }
}
RollupDefiClaimProofData.ENCODED_LENGTH = 129;
