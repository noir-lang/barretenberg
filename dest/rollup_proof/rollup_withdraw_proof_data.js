"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "RollupWithdrawProofData", {
    enumerable: !0,
    get: ()=>RollupWithdrawProofData
});
const _address = require("../address"), _bigintBuffer = require("../bigint_buffer"), _clientProofs = require("../client_proofs"), _innerProof = require("./inner_proof");
class RollupWithdrawProofData {
    get ENCODED_LENGTH() {
        return RollupWithdrawProofData.ENCODED_LENGTH;
    }
    get assetId() {
        return this.proofData.publicAssetId.readUInt32BE(28);
    }
    get publicValue() {
        return (0, _bigintBuffer.toBigIntBE)(this.proofData.publicValue);
    }
    get publicOwner() {
        return new _address.EthAddress(this.proofData.publicOwner);
    }
    static decode(encoded) {
        let proofId = encoded.readUInt8(0);
        if (proofId !== _clientProofs.ProofId.WITHDRAW) throw Error('Not a withdraw proof.');
        let offset = 1, noteCommitment1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let noteCommitment2 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier2 = encoded.slice(offset, offset + 32);
        offset += 32;
        let publicValue = encoded.slice(offset, offset + 32);
        offset += 32;
        let publicOwner = Buffer.concat([
            Buffer.alloc(12),
            encoded.slice(offset, offset + 20)
        ]);
        offset += 20;
        let publicAssetId = Buffer.concat([
            Buffer.alloc(28),
            encoded.slice(offset, offset + 4)
        ]);
        return new RollupWithdrawProofData(new _innerProof.InnerProofData(_clientProofs.ProofId.WITHDRAW, noteCommitment1, noteCommitment2, nullifier1, nullifier2, publicValue, publicOwner, publicAssetId));
    }
    encode() {
        let { noteCommitment1 , noteCommitment2 , nullifier1 , nullifier2 , publicValue , publicAssetId  } = this.proofData, encodedAssetId = publicAssetId.slice(28, 32);
        return Buffer.concat([
            Buffer.from([
                _clientProofs.ProofId.WITHDRAW
            ]),
            noteCommitment1,
            noteCommitment2,
            nullifier1,
            nullifier2,
            publicValue,
            this.publicOwner.toBuffer(),
            encodedAssetId
        ]);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== _clientProofs.ProofId.WITHDRAW) throw Error('Not a withdraw proof.');
    }
}
RollupWithdrawProofData.ENCODED_LENGTH = 185;
