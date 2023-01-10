"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "RollupDefiDepositProofData", {
    enumerable: !0,
    get: ()=>RollupDefiDepositProofData
});
const _bigintBuffer = require("../bigint_buffer"), _bridgeId = require("../bridge_id"), _clientProofs = require("../client_proofs"), _innerProof = require("./inner_proof");
class RollupDefiDepositProofData {
    get ENCODED_LENGTH() {
        return RollupDefiDepositProofData.ENCODED_LENGTH;
    }
    get bridgeId() {
        return _bridgeId.BridgeId.fromBuffer(this.proofData.publicAssetId);
    }
    get deposit() {
        return (0, _bigintBuffer.toBigIntBE)(this.proofData.publicValue);
    }
    static decode(encoded) {
        let proofId = encoded.readUInt8(0);
        if (proofId !== _clientProofs.ProofId.DEFI_DEPOSIT) throw Error('Not a defi deposit proof.');
        let offset = 1, noteCommitment1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let noteCommitment2 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier2 = encoded.slice(offset, offset + 32);
        return new RollupDefiDepositProofData(new _innerProof.InnerProofData(_clientProofs.ProofId.DEFI_DEPOSIT, noteCommitment1, noteCommitment2, nullifier1, nullifier2, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)));
    }
    encode() {
        let { noteCommitment1 , noteCommitment2 , nullifier1 , nullifier2  } = this.proofData;
        return Buffer.concat([
            Buffer.from([
                _clientProofs.ProofId.DEFI_DEPOSIT
            ]),
            noteCommitment1,
            noteCommitment2,
            nullifier1,
            nullifier2
        ]);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== _clientProofs.ProofId.DEFI_DEPOSIT) throw Error('Not a defi deposit proof.');
    }
}
RollupDefiDepositProofData.ENCODED_LENGTH = 129;
