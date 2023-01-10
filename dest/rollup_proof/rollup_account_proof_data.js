"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "RollupAccountProofData", {
    enumerable: !0,
    get: ()=>RollupAccountProofData
});
const _clientProofs = require("../client_proofs"), _innerProof = require("./inner_proof");
class RollupAccountProofData {
    get ENCODED_LENGTH() {
        return RollupAccountProofData.ENCODED_LENGTH;
    }
    static decode(encoded) {
        let proofId = encoded.readUInt8(0);
        if (proofId !== _clientProofs.ProofId.ACCOUNT) throw Error('Not an account proof.');
        let offset = 1, noteCommitment1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let noteCommitment2 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier2 = encoded.slice(offset, offset + 32);
        return new RollupAccountProofData(new _innerProof.InnerProofData(_clientProofs.ProofId.ACCOUNT, noteCommitment1, noteCommitment2, nullifier1, nullifier2, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)));
    }
    encode() {
        let { noteCommitment1 , noteCommitment2 , nullifier1 , nullifier2  } = this.proofData;
        return Buffer.concat([
            Buffer.from([
                _clientProofs.ProofId.ACCOUNT
            ]),
            noteCommitment1,
            noteCommitment2,
            nullifier1,
            nullifier2
        ]);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== _clientProofs.ProofId.ACCOUNT) throw Error('Not an account proof.');
    }
}
RollupAccountProofData.ENCODED_LENGTH = 129;
