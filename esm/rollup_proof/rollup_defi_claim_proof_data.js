import { BridgeId } from '../bridge_id';
import { ProofId } from '../client_proofs';
import { InnerProofData } from './inner_proof';
export class RollupDefiClaimProofData {
    get ENCODED_LENGTH() {
        return RollupDefiClaimProofData.ENCODED_LENGTH;
    }
    get bridgeId() {
        return BridgeId.fromBuffer(this.proofData.publicAssetId);
    }
    static decode(encoded) {
        let proofId = encoded.readUInt8(0);
        if (proofId !== ProofId.DEFI_CLAIM) throw Error('Not a defi claim proof.');
        let offset = 1, noteCommitment1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let noteCommitment2 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier1 = encoded.slice(offset, offset + 32);
        offset += 32;
        let nullifier2 = encoded.slice(offset, offset + 32);
        return new RollupDefiClaimProofData(new InnerProofData(ProofId.DEFI_CLAIM, noteCommitment1, noteCommitment2, nullifier1, nullifier2, Buffer.alloc(32), Buffer.alloc(32), Buffer.alloc(32)));
    }
    encode() {
        let { noteCommitment1 , noteCommitment2 , nullifier1 , nullifier2  } = this.proofData;
        return Buffer.concat([
            Buffer.from([
                ProofId.DEFI_CLAIM
            ]),
            noteCommitment1,
            noteCommitment2,
            nullifier1,
            nullifier2
        ]);
    }
    constructor(proofData){
        if (this.proofData = proofData, proofData.proofId !== ProofId.DEFI_CLAIM) throw Error('Not a defi claim proof.');
    }
}
RollupDefiClaimProofData.ENCODED_LENGTH = 129;
